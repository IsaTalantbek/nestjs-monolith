import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { PrismaService } from '../../core/database/prisma.service'
import * as bcrypt from 'bcryptjs'

@Injectable()
export class AuthService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly jwtService: JwtService
    ) {}

    async validateUser(login: string, password: string): Promise<any> {
        const user = await this.prisma.account.findUnique({ where: { login } })
        if (user && (await bcrypt.compare(password, user.password))) {
            const { password, ...result } = user
            return result
        }
        return null
    }

    async login(user: any) {
        const payload = { userId: user.id }
        console.log(payload)
        return {
            access_token: this.jwtService.sign(payload),
        }
    }

    async register(login: string, password: string) {
        const hashedPassword = await bcrypt.hash(password, 10)
        return this.prisma.account.create({
            data: {
                login,
                password: hashedPassword,
            },
        })
    }
}
