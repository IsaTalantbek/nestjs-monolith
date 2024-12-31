import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { PrismaService } from '../../core/database/prisma.service'
import * as bcrypt from 'bcryptjs'
import { loginForm, registerForm } from './auth.DTO'

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

    async login(user: any) {
        const payload = { userId: user.id, accountRole: user.accountRole }
        console.log(payload)
        return {
            access_token: this.jwtService.sign(payload),
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
