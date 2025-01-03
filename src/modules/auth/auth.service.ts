import { Injectable } from '@nestjs/common'
import { PrismaService } from '../../core/database/prisma.service'
import * as bcrypt from 'bcryptjs'
import { loginForm, registerForm } from './auth.dto'
import { jwtAccessData, jwtRefreshData } from 'src/core/keys/jwt.settings'
import { JwtTokenService } from 'src/core/keys/jwt.service'

@Injectable()
export class AuthService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly jwtTokenService: JwtTokenService
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
        const accessPayload = jwtAccessData(user)
        const refreshPayload = jwtRefreshData(user)

        const access_token =
            this.jwtTokenService.generateAccessToken(accessPayload)
        const refresh_token =
            this.jwtTokenService.generateRefreshToken(refreshPayload)

        return {
            access_token,
            refresh_token,
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
        const user = await this.prisma.account.create({
            data: {
                login,
                password: hashedPassword,
                email,
                createBy: 'AuthService',
            },
        })
        const profile = await this.prisma.profile.create({
            data: {
                userId: user.id,
                profileType: 'personal',
                passwordLength: password.length,
                createBy: 'authService',
            },
        })
        return { user, profile }
    }
}
