import 'fastify'

declare module 'fastify' {
    interface FastifyRequest {
        user?: { accountId: string; sessionId?: string }
    }
}
