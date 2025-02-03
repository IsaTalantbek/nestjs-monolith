import { Module } from '@nestjs/common'
import { SessionController } from './session.controller.js'
import { SessionModule } from '../../../common/service/session/session.module.js'
import { CookieModule } from '../../../core/keys/cookie/cookie.module.js'

@Module({
    imports: [SessionModule, CookieModule],
    controllers: [SessionController],
})
export class SessionControllerModule {}
