import { Module } from '@nestjs/common'
import { SessionService } from './session.service'
import { SessionController } from './session.controller'
import { AuthPackModule } from 'src/auth.pack.module'

@Module({
    exports: [SessionService],
    imports: [AuthPackModule],
    controllers: [SessionController],
    providers: [SessionService],
})
export class SesionModule {}
