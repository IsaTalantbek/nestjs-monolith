import { Controller } from '@nestjs/common'
import { FastifyReply, FastifyRequest } from 'fastify'
import { PrivacyService } from './privacy.service.js'
import {
    GivePrivacyDTO,
    GivePrivacyQueryDTO,
    UpdatePrivacyBodyDTO,
} from './sample/privacy.dto.js'
import { PrivacyController_BASE } from './privacy.base.controller.js'

@Controller('profile/privacy')
export class PrivacyController extends PrivacyController_BASE {
    constructor(private readonly privacy: PrivacyService) {
        super()
    }
    async givePrivacy(
        reply: FastifyReply,
        req: FastifyRequest,
        givePrivacyDTO: GivePrivacyQueryDTO
    ) {
        const accountId = req.user.accountId
        const { profileId } = givePrivacyDTO
        const result: GivePrivacyDTO | string = await this.privacy.givePrivacy(
            accountId,
            profileId
        )
        if (!(result instanceof GivePrivacyDTO)) {
            return reply.status(400).send({
                message: result,
            })
        }
        reply.status(200).send(result)
        return result
    }
    async updatePrivacy(
        reply: FastifyReply,
        req: FastifyRequest,
        updatePrivacyDto: UpdatePrivacyBodyDTO
    ) {
        const accountId = req.user.accountId
        const { profileId, value, update } = updatePrivacyDto
        const result: string | boolean = await this.privacy.updatePrivacy(
            profileId,
            update,
            value,
            accountId
        )
        if (result !== true) {
            return reply.status(400).send({ message: result })
        }
        return reply
            .status(200)
            .send({ message: 'Изменения успешно сохранены' })
    }
}
