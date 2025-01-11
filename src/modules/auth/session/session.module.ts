import { Module } from '@nestjs/common'
import { SessionController } from './session.controller'
import { AuthPackModule } from 'src/auth.pack.module'
import { MutexManager } from 'src/common/util/mutex.manager'
import { SessionService } from './session.service'

@Module({
    imports: [AuthPackModule],
    controllers: [SessionController],
    providers: [SessionService],
})
export class SesionModule {}
