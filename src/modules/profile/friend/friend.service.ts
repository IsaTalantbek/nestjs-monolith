import { Injectable } from '@nestjs/common'
import { PrismaService } from '../../../core/database/prisma.service'
import * as _ from 'lodash'
import { Mutex } from 'async-mutex'

@Injectable()
export class FriendService {
    private readonly userLocks = new Map<string, Mutex>()
    constructor(private readonly prisma: PrismaService) {}

    private getMutex(userId: string): Mutex {
        if (!this.userLocks.has(userId)) {
            this.userLocks.set(userId, new Mutex())
        }
        return this.userLocks.get(userId)!
    }

    async giveActiveFriends(userId: string) {
        const data = await this.prisma.friend.findMany({
            where: {
                OR: [
                    { userId: userId, type: 'active' },
                    { vsUserId: userId, type: 'active' },
                ],
            },
        })
        return data.map((friend) => _.pick(friend, 'userId', 'vsUserId'))
    }
    async giveWaitingFriends(userId: string) {
        const data = await this.prisma.friend.findMany({
            where: {
                OR: [
                    { userId: userId, type: 'waiting' },
                    { vsUserId: userId, type: 'waiting' },
                ],
            },
        })
        return data.map((friend) => _.pick(friend, 'userId', 'vsUserId'))
    }

    async addFriend(userId: string, vsUserId: string) {
        const userMutex = this.getMutex(userId)

        // Блокируем операцию до её завершения
        const release = await userMutex.acquire()
        try {
            const check = await this.prisma.account.findUnique({
                where: { id: vsUserId },
            })
            if (!check) {
                return 'Такого пользователя не существует'
            }
            const check2 = await this.prisma.friend.findFirst({
                where: {
                    OR: [
                        { userId: userId, vsUserId: vsUserId },
                        { userId: vsUserId, vsUserId: userId },
                    ],
                },
            })
            if (check2 && check2.type === 'inactive') {
                await this.prisma.friend.update({
                    where: { id: check2.id },
                    data: { type: 'waiting', updatedBy: userId },
                })
                return true
            }
            if (check2) {
                return 'Вы уже друзья'
            }
            await this.prisma.friend.create({
                data: {
                    userId: userId,
                    vsUserId: vsUserId,
                    createdBy: userId,
                    type: 'active',
                },
            })
            return true
        } finally {
            release()
        }
    }
    async acceptFriend(userId: string, friendId: string) {
        const check = await this.prisma.friend.findFirst({
            where: {
                userId: friendId,
                vsUserId: userId,
                type: 'active',
            },
        })
        if (!check) {
            return 'Похоже, вам никто не кидал заявку в друзья'
        }
        await this.prisma.friend.update({
            where: { id: check.id },
            data: { type: 'active', updatedBy: userId },
        })
        return true
    }
    async deleteFriend(userId, vsUserId) {
        const check = await this.prisma.friend.findFirst({
            where: {
                OR: [
                    { userId: userId, vsUserId: vsUserId },
                    {
                        userId: vsUserId,
                        vsUserId: userId,
                    },
                ],
            },
        })
        if (!check) {
            return 'Такого друга у вас нет'
        }
        await this.prisma.friend.update({
            where: { id: check.id },
            data: { type: 'inactive', updatedBy: userId },
        })
        return true
    }
}
