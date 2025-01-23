import { Injectable } from '@nestjs/common'
import { PrismaService } from '../../../core/database/prisma.service.js'
import bcrypt from 'bcryptjs'
import { loginForm, registerForm } from './auth.dto.js'
import {
    JwtAuthService,
    NewRefreshToken,
} from '../../../core/keys/jwt/jwt.auth.service.js'
import { SessionService } from '../../../core/session/session.service.js'
import { MutexService } from '../../../core/util/mutex/mutex.service.js'
import { Session } from '@prisma/client'
import { UUID } from 'crypto'

@Injectable()
export class AuthService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly jwtAuth: JwtAuthService,
        private readonly session: SessionService,
        private readonly mutex: MutexService
    ) {}

    async validateUser({ slug, password }: loginForm): Promise<boolean | any> {
        const user = await this.prisma.profile.findUnique({
            where: { slug },
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
    ): Promise<NewRefreshToken> {
        return this.mutex.lock(accountId, async () => {
            const expiresAt = new Date(Date.now() + ttl)
            const existSession: Session = await this.prisma.session.findFirst({
                where: {
                    accountId: accountId,
                    deleted: false,
                    ipAdress,
                    headers,
                },
            })
            const sessionId: UUID = existSession.id as UUID
            if (existSession?.expiresAt < new Date()) {
                await this.session.cleanExpiredSession(sessionId)
            } else if (existSession) {
                const { newRefreshToken } =
                    this.jwtAuth.generateRefreshToken(sessionId)
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
            const newSession = await this.prisma.session.create({
                data: data,
            })
            const newSessionId: UUID = newSession.id as UUID

            const { newRefreshToken } =
                this.jwtAuth.generateRefreshToken(newSessionId)

            return {
                newRefreshToken,
            }
        })
    }

    async ifUserExist(slug?: string, email?: string) {
        let check, check2

        if (email) {
            check = await this.prisma.account.findUnique({
                where: { email: email },
            })
        }
        if (slug) {
            check2 = await this.prisma.profile.findUnique({
                where: { slug: slug },
            })
        }
        if (check || check2) {
            return true
        }
        return false
    }

    async register({ slug, password, email, headers }: registerForm) {
        return this.mutex.lock(slug, async () => {
            const check = await this.ifUserExist(slug, email)
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
                                slug: slug,
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
