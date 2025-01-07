import { Injectable } from '@nestjs/common'
import { PrismaService } from '../../../core/database/prisma.service'
import { Mutex } from 'async-mutex'

@Injectable()
export class FriendService {
    private readonly userLocks = new Map<string, Mutex>()
    constructor(private readonly prisma: PrismaService) {}

    private getMutex(accountId: string): Mutex {
        if (!this.userLocks.has(accountId)) {
            this.userLocks.set(accountId, new Mutex())
        }
        return this.userLocks.get(accountId)!
    }

    async giveActiveFriends(accountId: string) {
        const data = await this.prisma.friend.findMany({
            where: {
                OR: [
                    { initAid: accountId, type: 'active' },
                    { vsAid: accountId, type: 'active' },
                ],
            },
        })
        return data.map(({ initAid, vsAid }) => ({ initAid, vsAid }))
    }
    async giveWaitingFriends(accountId: string) {
        const data = await this.prisma.friend.findMany({
            where: {
                OR: [
                    { initAid: accountId, type: 'waiting' },
                    { vsAid: accountId, type: 'waiting' },
                ],
            },
        })
        return data.map(({ initAid, vsAid }) => ({ initAid, vsAid }))
    }

    async addFriend(accountId: string, vsAid: string) {
        const userMutex = this.getMutex(accountId)

        // Блокируем операцию до её завершения
        const release = await userMutex.acquire()
        try {
            const check = await this.prisma.account.findUnique({
                where: { id: vsAid },
            })
            if (!check) {
                return 'Такого пользователя не существует'
            }
            const check2 = await this.prisma.friend.findFirst({
                where: {
                    OR: [
                        { initAid: accountId, vsAid: vsAid },
                        { initAid: vsAid, vsAid: accountId },
                    ],
                },
            })
            if (check2 && check2.type === 'inactive') {
                await this.prisma.friend.update({
                    where: { id: check2.id },
                    data: { type: 'waiting', updatedBy: accountId },
                })
                return true
            }
            if (check2) {
                return 'Вы уже друзья, или ваш запрос еще не приняли'
            }
            await this.prisma.friend.create({
                data: {
                    initAid: accountId,
                    vsAid: vsAid,
                    createdBy: accountId,
                    type: 'active',
                },
            })
            return true
        } finally {
            release()
        }
    }
    async acceptFriend(accountId: string, friendId: string) {
        const check = await this.prisma.friend.findFirst({
            where: {
                initAid: friendId,
                vsAid: accountId,
                type: 'active',
            },
        })
        if (!check) {
            return 'Похоже, вам никто не кидал заявку в друзья'
        }
        await this.prisma.friend.update({
            where: { id: check.id },
            data: { type: 'active', updatedBy: accountId },
        })
        return true
    }
    async deleteFriend(accountId, vsAid) {
        const check = await this.prisma.friend.findFirst({
            where: {
                OR: [
                    { initAid: accountId, vsAid: vsAid },
                    {
                        initAid: vsAid,
                        vsAid: accountId,
                    },
                ],
            },
        })
        if (!check) {
            return 'Такого друга у вас нет'
        }
        await this.prisma.friend.update({
            where: { id: check.id },
            data: { type: 'inactive', updatedBy: accountId },
        })
        return true
    }
}
