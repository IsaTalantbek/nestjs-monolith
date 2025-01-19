import { UUID } from 'crypto'
import 'fastify'

declare module 'fastify' {
    interface FastifyRequest {
        user?: { accountId: UUID; sessionId?: UUID }
    }
}
