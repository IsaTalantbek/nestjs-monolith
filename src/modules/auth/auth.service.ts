import { Injectable } from '@nestjs/common'
import { PrismaService } from '../../core/database/prisma.service'
import * as bcrypt from 'bcryptjs'
import { loginForm, registerForm } from './auth.DTO'
import { jwtCreate } from 'src/core/keys/jwt.create'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class AuthService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly configService: ConfigService
    ) {}

    async validateUser({ login, password }: loginForm): Promise<any> {
        const user = await this.prisma.account.findUnique({ where: { login } })
        if (user && (await bcrypt.compare(password, user.password))) {
            const { password, ...result } = user
            return result
        }
        return null
    }

    async login(user: any) {
        const payload = { userId: user.id, accountRole: user.accountRole }
        return {
            access_token: jwtCreate(payload, this.configService),
        }
    }

    async register({ login, password, email }: registerForm) {
        const check = await this.prisma.account.findUnique({
            where: { login: login },
        })
        if (check) {
            return 'Пользователь уже существует'
        }
        const hashedPassword = await bcrypt.hash(password, 10)
        const user = await this.prisma.account.create({
            data: {
                login,
                password: hashedPassword,
                email,
                createBy: 'authService',
            },
        })
        const profile = await this.prisma.profile.create({
            data: {
                userId: user.id,
                profileType: 'personal',
                createBy: 'authService',
            },
        })
        return { user, profile }
    }
}
