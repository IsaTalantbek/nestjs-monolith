import { Module } from '@nestjs/common'
import { SessionController } from './session.controller'
import { AuthPackModule } from 'src/auth.pack.module'
import { SessionService } from './session.service'

@Module({
    imports: [AuthPackModule],
    exports: [SessionService],
    controllers: [SessionController],
    providers: [SessionService],
})
export class SesionModule {}
