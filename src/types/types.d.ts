import { UUID } from 'crypto'
import 'fastify'

export interface RequestUserInterface {
    user?: { accountId: UUID; sessionId: UUID }
}

declare module 'fastify' {
    interface FastifyRequest {
        user?: RequestUserInterface['user']
    }
}
