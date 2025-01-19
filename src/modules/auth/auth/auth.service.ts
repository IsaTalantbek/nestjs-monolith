import { Injectable } from '@nestjs/common'
import { PrismaService } from '../../../core/database/prisma.service.js'
import bcrypt from 'bcryptjs'
import { loginForm, registerForm } from './auth.dto.js'
import { JwtAuthService } from '../../../core/keys/jwt/jwt.auth.service.js'
import { SessionService } from '../../../core/session/session.service.js'
import { MutexManager } from '../../../core/util/mutex.manager.js'

@Injectable()
export class AuthService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly jwtAuth: JwtAuthService,
        private readonly session: SessionService,
        private readonly mutex: MutexManager
    ) {}

    async validateUser({ login, password }: loginForm): Promise<boolean | any> {
        const user = await this.prisma.profile.findUnique({
            where: { login },
            include: { owner: true },
        })
        if (user && (await bcrypt.compare(password, user.owner.password))) {
            return user.owner.id
        }
        return false
    }

    async login(
        accountId: string,
        ipAdress: string,
        ipAdressFull: string,
        headers: string,
        ttl: number = 24 * 60 * 60 * 1000 * 7
    ) {
        return this.mutex.lock(accountId, async () => {
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

            superUser = !superUserCheck
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

    async ifUserExist(login?: string, email?: string) {
        let check, check2

        if (email) {
            check = await this.prisma.account.findUnique({
                where: { email: email },
            })
        }
        if (login) {
            check2 = await this.prisma.profile.findUnique({
                where: { login: login },
            })
        }
        if (check || check2) {
            return true
        }
        return false
    }

    async register({ login, password, email, headers }: registerForm) {
        return this.mutex.lock(login, async () => {
            const check = await this.ifUserExist(login, email)
            if (check) {
                return 'Пользователь уже существует'
            }

            const hashedPassword = await bcrypt.hash(password, 10)

            return this.prisma.$transaction(async (prisma) => {
                // Внутри транзакции все операции должны быть атомарными и независимыми
                return prisma.account.create({
                    data: {
                        password: hashedPassword,
                        email,
                        createdBy: headers,
                        profiles: {
                            create: {
                                login: login,
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
            })
        })
    }
}
