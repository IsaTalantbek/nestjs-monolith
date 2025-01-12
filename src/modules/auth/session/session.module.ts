import { Module } from '@nestjs/common'
import { SessionController } from './session.controller.js'
import { AuthPackModule } from '../../../auth.pack.module.js'
import { SessionService } from './session.service.js'

@Module({
    imports: [AuthPackModule],
    exports: [SessionService],
    controllers: [SessionController],
    providers: [SessionService],
})
export class SesionModule {}
