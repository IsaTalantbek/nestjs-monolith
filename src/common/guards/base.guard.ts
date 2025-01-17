import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { FastifyRequest, FastifyReply } from 'fastify'
import { errorStatic } from '../../core/util/error.static.js'

@Injectable()
export abstract class BaseGuard implements CanActivate {
    abstract handleRequest(
        request: FastifyRequest,
        reply: FastifyReply
    ): boolean | Promise<boolean>

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest<FastifyRequest>()
        const reply = context.switchToHttp().getResponse<FastifyReply>()

        try {
            return await this.handleRequest(request, reply)
        } catch (error) {
            errorStatic(error, reply, 'GUARDS', 'авторизации')
            return false
        }
    }
}
