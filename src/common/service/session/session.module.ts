import { Module } from '@nestjs/common'
import { MutexModule } from '@util/mutex'
import { PrismaModule } from '@core/prisma'
import { SessionService } from './session.service.js'

@Module({
    imports: [PrismaModule, MutexModule],
    providers: [SessionService],
    exports: [SessionService],
})
export class SessionModule {}
