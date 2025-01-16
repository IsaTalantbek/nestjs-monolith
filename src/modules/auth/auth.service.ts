import { Injectable } from '@nestjs/common'
import { PrismaService } from '../../core/database/prisma.service.js'
import bcrypt from 'bcryptjs'
import { loginForm, registerForm } from './auth.dto.js'
import { JwtAuthService } from '../../core/keys/jwt/jwt.auth.service.js'
import { SessionService } from '../../core/session/session.service.js'
import { MutexManager } from '../../common/util/mutex.manager.js'

@Injectable()
export class AuthService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly jwtAuth: JwtAuthService,
        private readonly session: SessionService,
        private readonly mutex: MutexManager
    ) {}

    async validateUser({ login, password }: loginForm): Promise<any> {
        const user = await this.prisma.account.findUnique({ where: { login } })
        if (user && (await bcrypt.compare(password, user.password))) {
            const { password, ...result } = user
            return result
        }
        return null
    }

    async login(
        accountId: string,
        ipAdress: string,
        ipAdressFull: string,
        headers: string,
        ttl: number = 24 * 60 * 60 * 1000 * 7
    ) {
        return this.mutex.blockWithMutex(accountId, async () => {
            const expiresAt = new Date(Date.now() + ttl)
            const existSession = await this.prisma.session.findFirst({
                where: {
                    accountId: accountId,
                    deleted: false,
                    ipAdress,
                    headers,
                },
            })
            if (existSession?.expiresAt < new Date()) {
                await this.session.cleanExpiredSession(existSession.id)
            } else if (existSession) {
                const { newRefreshToken } = this.jwtAuth.generateRefreshToken(
                    existSession.id
                )
                return {
                    newRefreshToken,
                }
            }
            let superUser: boolean

            const superUserCheck = await this.prisma.session.findFirst({
                where: { deleted: false, superUser: true, accountId },
            })

            superUserCheck ? (superUser = false) : (superUser = true)
            const data: {
                accountId: string
                expiresAt: any
                ipAdress: string
                ipAdressFull: string
                headers: string
                superUser: boolean
            } = {
                accountId,
                expiresAt,
                ipAdress,
                ipAdressFull,
                headers,
                superUser,
            }
            const session = await this.prisma.session.create({
                data: data,
            })

            const { newRefreshToken } = this.jwtAuth.generateRefreshToken(
                session.id
            )

            return {
                newRefreshToken,
            }
        })
    }

    async ifUserExist(login: string, email?: string) {
        const check = await this.prisma.account.findFirst({
            where: { OR: [{ login: login }, { email: email }] },
        })
        if (check) {
            return true
        }
        return false
    }

    async register({ login, password, email, headers }: registerForm) {
        return this.mutex.blockWithMutex(login, async () => {
            const check = await this.ifUserExist(login, email)
            if (check) {
                return 'Пользователь уже существует'
            }

            const hashedPassword = await bcrypt.hash(password, 10)

            const result = await this.prisma.$transaction(async (prisma) => {
                // Внутри транзакции все операции должны быть атомарными и независимыми
                const user = await prisma.account.create({
                    data: {
                        login,
                        password: hashedPassword,
                        email,
                        createdBy: headers,
                        profile: {
                            create: {
                                profileType: 'personal',
                                createdBy: headers,
                                privacy: {
                                    create: {
                                        createdBy: headers,
                                    },
                                },
                                stats: {
                                    create: {
                                        createdBy: headers,
                                    },
                                },
                            },
                        },
                    },
                })

                return user // Возвращаем результаты
            })

            return result // Если все прошло успешно, возвращаем данные
        })
    }
}
