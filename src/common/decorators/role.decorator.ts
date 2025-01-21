import { UseGuards } from '@nestjs/common'

const guardCache = new Map<string, any>()

export function Role(role: string) {
    if (!guardCache.has(role)) {
    }

    return UseGuards(guardCache.get(role))
}
