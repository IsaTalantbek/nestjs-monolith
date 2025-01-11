import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Put,
    Req,
    Res,
    UseGuards,
    UsePipes,
} from '@nestjs/common'
import { JwtGuard } from 'src/common/guards/jwt/jwt.guard'
import { BlackLIstService } from './blacklist.service'
import { ParamUuidPipe } from 'src/common/pipes/paramUUID.pipe'

@Controller('profile/blacklist')
@UseGuards(JwtGuard)
export class BlackListController {
    constructor(private readonly blackListService: BlackLIstService) {}

    @Get()
    async getBlackList(@Res() reply: any, @Req() req: any) {
        try {
            const accountId = req.user.accountId
            const result = await this.blackListService.getBlackList(accountId)
            return reply.status(200).send(result)
        } catch (error) {
            console.error(`BlackList-Give: ${error}`)
            return reply.status(500).send({
                message:
                    'Возникла ошибка при попытке получить пользователей из ЧС. Пожалуйста, сообщите нам подробности',
            })
        }
    }

    @UsePipes(ParamUuidPipe)
    @Post(':vsPid')
    async addToBlackList(
        @Param('vsPid') vsPid: string,
        @Res() reply: any,
        @Req() req: any
    ) {
        try {
            const accountId = req.user.accountId
            const result = await this.blackListService.addToBlackList({
                accountId,
                vsPid,
            })
            if (result !== true) {
                return reply.status(400).send({ message: result })
            }
            return reply.status(200).send({
                message: 'Пользователь успешно добавлен в черный список',
            })
        } catch (error: any) {
            console.error(`BlackList-Add: ${error}`)
            return reply.status(500).send({
                message:
                    'Возникла ошибка при попытке добавить пользователя в ЧС. Пожалуйста, сообщите нам подробности',
            })
        }
    }

    @UsePipes(ParamUuidPipe)
    @Put(':vsPid')
    async deleteFromBlackList(
        @Param('vsPid') vsPid: string,
        @Res() reply: any,
        @Req() req: any
    ) {
        try {
            const accountId = req.user.accountId
            const result = await this.blackListService.deleteFromBlackList({
                accountId,
                vsPid,
            })
            if (result !== true) {
                return reply.status(400).send({ message: result })
            }
            return reply.status(200).send({
                message: 'Пользователь успешно удален из черного списка',
            })
        } catch (error: any) {
            console.error(`BlackList-Remove: ${error}`)
            return reply.status(500).send({
                message:
                    'Возникла ошибка при попытке удалить пользоваля из ЧС. Пожалуйста, сообщите нам подробности',
            })
        }
    }

    @Delete()
    async deleteAllFromBlackList(@Res() reply: any, @Req() req: any) {
        try {
            const accountId = req.user.accountId
            const result =
                await this.blackListService.deleteAllFromBlackList(accountId)
            if (result !== true) {
                return reply.status(400).send({ message: result })
            }
            return reply.status(200).send({
                message: 'Пользователи успешно удалены из черного списка',
            })
        } catch (error) {
            console.error(`BlackList-RemoveAll: ${error}`)
            return reply.status(500).send({
                message:
                    'Возникла ошибка при попытке удалить всех пользователей из ЧС. Пожалуйста, сообщите нам подробности',
            })
        }
    }
}
