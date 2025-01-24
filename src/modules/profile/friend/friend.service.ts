import { Injectable } from '@nestjs/common'
import { PrismaService } from '../../../core/database/prisma.service.js'
import { MutexService } from '../../../core/util/mutex/mutex.service.js'
import { ActiveWaitingFriend } from './sample/friend.dto.js'
import { UUID } from 'crypto'
import { GiveFriendsDTO } from '../privacy/sample/privacy.dto.js'
import { plainToInstance } from 'class-transformer'
import { Account, Friend } from '@prisma/client'
import { FriendService_INTERFACE } from './sample/friend.interface.js'

@Injectable()
export class FriendService implements FriendService_INTERFACE {
    constructor(
        private readonly prisma: PrismaService,
        private readonly mutex: MutexService
    ) {}

    async giveFriends(
        accountId: UUID,
        option: ActiveWaitingFriend
    ): Promise<GiveFriendsDTO[]> {
        const result: Friend[] = await this.prisma.friend.findMany({
            where: {
                OR: [
                    { initAid: accountId, type: option },
                    { vsAid: accountId, type: option },
                ],
            },
        })
        return plainToInstance(GiveFriendsDTO, result, {
            excludeExtraneousValues: true, // Исключить поля без @Expose
        })
    }

    async addFriend(accountId: UUID, vsAid: UUID): Promise<boolean | string> {
        return this.mutex.lock(accountId, async () => {
            const check: Account = await this.prisma.account.findUnique({
                where: { id: vsAid },
            })
            if (!check) {
                return 'Такого пользователя не существует'
            }
            const check2: Friend = await this.prisma.friend.findFirst({
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
    async acceptFriend(
        accountId: UUID,
        friendId: UUID
    ): Promise<boolean | string> {
        const check: Friend = await this.prisma.friend.findFirst({
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
    async deleteFriend(
        accountId: UUID,
        vsAid: UUID
    ): Promise<boolean | string> {
        const check: Friend = await this.prisma.friend.findFirst({
            where: {
                OR: [
                    {
                        initAid: accountId,
                        vsAid: vsAid,
                    },
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
