import { Injectable } from '@nestjs/common'
import { PrismaService } from '../../../core/database/prisma.service'
import { MutexManager } from 'src/common/util/mutex.manager'
import { vsAidFriendDto } from './friend.dto'

@Injectable()
export class FriendService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly mutex: MutexManager
    ) {}

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

    async addFriend({ accountId, vsAid }: vsAidFriendDto) {
        return this.mutex.blockWithMutex(accountId, async () => {
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
                    type: 'waiting',
                },
            })
            return true
        })
    }
    async acceptFriend(accountId: string, friendId: string) {
        const check = await this.prisma.friend.findFirst({
            where: {
                initAid: friendId,
                vsAid: accountId,
                type: 'waiting',
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
    async deleteFriend({ accountId, vsAid }: vsAidFriendDto) {
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
