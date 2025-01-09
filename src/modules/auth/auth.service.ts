import { Injectable } from '@nestjs/common'
import { PrismaService } from '../../core/database/prisma.service'
import * as bcrypt from 'bcryptjs'
import { loginForm, registerForm } from './auth.dto'
import { JwtService } from 'src/core/keys/jwt/jwt.service'
import { SessionService } from './session/session.service'

@Injectable()
export class AuthService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly jwtService: JwtService,
        private readonly sessionService: SessionService
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
        headers: string,
        ttl: number = 24 * 60 * 60 * 1000 * 7
    ) {
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
            await this.sessionService.cleanExpiredSession(existSession.id)
        } else if (existSession) {
            const { newRefreshToken } = this.jwtService.generateRefreshToken(
                existSession.id
            )

            return {
                newRefreshToken,
            }
        }
        let superUser: boolean

        const superUserCheck = await this.prisma.session.findFirst({
            where: { deleted: false, superUser: true },
        })

        superUserCheck ? (superUser = true) : (superUser = false)

        const data: {
            accountId: string
            expiresAt: any
            ipAdress: string
            headers: string
            superUser: boolean
        } = { accountId, expiresAt, ipAdress, headers, superUser }
        const session = await this.prisma.session.create({
            data: data,
        })

        const { newRefreshToken } = this.jwtService.generateRefreshToken(
            session.id
        )

        return {
            newRefreshToken,
        }
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

    async register({ login, password, email }: registerForm) {
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
                    createdBy: login,
                    profile: {
                        create: {
                            profileType: 'personal',
                            createdBy: login,
                            privacy: {
                                create: {
                                    createdBy: login,
                                },
                            },
                            stats: {
                                create: {
                                    createdBy: login,
                                },
                            },
                        },
                    },
                },
            })

            return user // Возвращаем результаты
        })

        return result // Если все прошло успешно, возвращаем данные
    }
}
