import { Injectable } from '@nestjs/common'
import { PrismaService } from '../../core/database/prisma.service'
import * as bcrypt from 'bcryptjs'
import { loginForm, registerForm } from './auth.dto'
import { JwtService } from 'src/core/keys/jwt/jwt.service'

@Injectable()
export class AuthService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly jwtService: JwtService
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
        data: Record<string, any>,
        ipAdress: string,
        headers: string,
        ttl: number = 24 * 60 * 60 * 1000
    ) {
        const expiresAt = new Date(Date.now() + ttl)

        const session = await this.prisma.session.create({
            data: {
                accountId,
                data,
                expiresAt,
                ipAdress,
                headers,
            },
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
