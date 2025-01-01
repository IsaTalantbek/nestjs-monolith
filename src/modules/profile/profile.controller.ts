import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common'
import { ProfileService } from './profile.service'
import { errorStatic } from 'src/util/error.static'
import { JwtGuard } from 'src/common/guards/jwt.guard'

@Controller('profile')
@UseGuards(JwtGuard)
export class ProfileController {
    constructor(private readonly profileService: ProfileService) {}
    @Get()
    async userProfile(@Res() reply: any, @Req() req: any) {
        try {
            const userId = req.user?.userId

            const result = await this.profileService.profile(userId)

            return reply.status(200).send(result)
        } catch (error: any) {
            return errorStatic(error, reply)
        }
    }
}
