import { Module } from '@nestjs/common'
import { SessionService } from './session.service.js'
import { PrismaModule } from '../database/prisma.module.js'
import { MutexModule } from '../util/mutex/mutex.module.js'

@Module({
    imports: [PrismaModule, MutexModule],
    providers: [SessionService],
    exports: [SessionService],
})
export class SessionModule {}
