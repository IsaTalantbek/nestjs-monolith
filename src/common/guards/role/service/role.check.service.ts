import { Injectable } from '@nestjs/common'
import { Account } from '@prisma/client'
import { FastifyRequest } from 'fastify'
import { PrismaService } from '../../../../core/database/prisma.service.js'
import { RGM } from '../role.guard.enum.js'

@Injectable()
export class RoleCheck {
    private roleHierarchy: Array<string>

    constructor(private readonly prisma: PrismaService) {
        this.roleHierarchy = [
            'owner', // 1
            'admin', // 2
            'developer', // 3
            'moderator', // 4
            'support', // 5
            'user', // 6
        ]
    }

    async use(req: FastifyRequest, role: RGM): Promise<boolean> {
        const userId = req.user!.accountId
        const check: Account | null = await this.prisma.account.findUnique({
            where: { id: userId },
        })
        if (!check) {
            throw new Error(
                `Попытка доступа к ${req.url} без аккунта, с фактическими данными ${req.user}`
            )
        }
        const userRole = check.accountRole
        if (userRole === 'user') {
            return false
        }
        const userRoleIndex = this.roleHierarchy.indexOf(userRole)
        const requiredRoleIndex = this.roleHierarchy.indexOf(role)

        // Проверяем, что роль пользователя выше или равна требуемой
        return userRoleIndex <= requiredRoleIndex
    }
}
