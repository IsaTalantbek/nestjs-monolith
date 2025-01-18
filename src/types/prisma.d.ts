import { Prisma } from '@prisma/client'

// Тип для Account с включением Profile
type AccountWithProfile = Prisma.AccountGetPayload<{
    include: { profile: true }
}>
