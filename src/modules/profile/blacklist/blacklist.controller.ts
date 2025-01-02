import {
    Body,
    Controller,
    Delete,
    Get,
    Post,
    Put,
    Req,
    Res,
    UseGuards,
} from '@nestjs/common'
import { JwtGuard } from 'src/common/guards/jwt.guard'
import { BlackLIstService } from './blacklist.service'
import { errorStatic } from 'src/common/util/error.static'
import { VsUserIdDto } from './blacklist.dto'

@Controller('profile/blacklist')
@UseGuards(JwtGuard)
export class BlackListController {
    constructor(private readonly blackListService: BlackLIstService) {}
    @Get()
    async giveBlackList(@Res() reply: any, @Req() req: any) {
        try {
            const userId = req.user.userId
            const result = await this.blackListService.giveBlackList(userId)
            if (result === 'Похоже, черный список пуст') {
                return reply.status(400).send({ message: result })
            }
            return reply.status(200).send(result)
        } catch (error) {
            errorStatic(error, reply)
            return
        }
    }

    @Post()
    async addToBlackList(
        @Body() vsUserIdDto: VsUserIdDto,
        @Res() reply: any,
        @Req() req: any
    ) {
        try {
            const userId = req.user.userId
            const { vsUserId } = vsUserIdDto
            const result = await this.blackListService.addToBlackList(
                userId,
                vsUserId
            )
            if (result !== true) {
                return reply.status(400).send({ message: result })
            }
            return reply.status(200).send({
                message: 'Пользователь успешно добавлен в черный список',
            })
        } catch (error: any) {
            errorStatic(error, reply)
            return
        }
    }
    @Put()
    async removeToBlackList(
        @Body() vsUserIdDto: VsUserIdDto,
        @Res() reply: any,
        @Req() req: any
    ) {
        try {
            const userId = req.user.userId
            const { vsUserId } = vsUserIdDto
            const result = await this.blackListService.removeToBlackList(
                userId,
                vsUserId
            )
            if (result !== true) {
                return reply.status(400).send({ message: result })
            }
            return reply.status(200).send({
                message: 'Пользователь успешно удален из черного списка',
            })
        } catch (error: any) {
            errorStatic(error, reply)
            return
        }
    }
    @Delete()
    async removeAllToBlackList(@Res() reply: any, @Req() req: any) {
        try {
            const userId = req.user.userId
            const result =
                await this.blackListService.removeAllToBlackList(userId)
            if (result !== true) {
                return reply.status(400).send({ message: result })
            }
            return reply.status(200).send({
                message: 'Пользователи успешно удалены из черного списка',
            })
        } catch (error) {
            errorStatic(error, reply)
            return
        }
    }
}
