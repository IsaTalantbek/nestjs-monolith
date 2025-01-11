import {
    Controller,
    Get,
    Param,
    Put,
    Query,
    Req,
    Res,
    UseGuards,
    UsePipes,
} from '@nestjs/common'
import { JwtCheck } from 'src/common/guards/jwt/jwt.check'
import { JwtGuard } from 'src/common/guards/jwt/jwt.guard'
import { SubscribeService } from './subscribe.service'
import { ParamUuidPipe } from 'src/common/pipes/paramUUID.pipe'
import { GiveSubscribesQueryDto } from './subscribe.dto'

@Controller('profile/subscribe')
export class SubscribeController {
    constructor(private readonly subscribeService: SubscribeService) {}
    @UseGuards(JwtCheck)
    @Get(':profileId')
    async getSubscribe(
        @Param('profileId') profileId: string,
        @Req() req: any,
        @Res() reply: any
    ) {
        try {
            const accountId = req.user?.accountId
            const result = await this.subscribeService.getSubscribe(
                accountId,
                profileId
            )
            if (result === 'Неправильные данные') {
                return reply.status(400).send({ message: result })
            }
            return reply.status(200).send(result)
        } catch (error) {
            console.error(`Get-Subscribe: ${error}`)
            return reply.status(500).send({
                message:
                    'Возникла ошибка при попытке получить данные подписки. Пожалуйста, сообщите нам что случилось',
            })
        }
    }
    @UseGuards(JwtGuard)
    @UsePipes(ParamUuidPipe)
    @Put(':profileId')
    async subscribe(
        @Param('profileId') profileId: string,
        @Req() req: any,
        @Res() reply: any
    ) {
        try {
            const accountId = req.user.accountId
            const result = await this.subscribeService.subscribe(
                accountId,
                profileId
            )
            if (result !== true) {
                return reply.status(400).sebd({ message: result })
            }
            return reply
                .status(200)
                .send({ message: 'Успешная подписка/отписка' })
        } catch (error) {
            console.error(`Subscribe: ${error}`)
            return reply.status(500).send({
                message:
                    'Возникла ошибка при попытке поодписаться. Пожалуйста, напишите нам что случилось',
            })
        }
    }
}
