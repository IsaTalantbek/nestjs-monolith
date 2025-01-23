import { Module } from '@nestjs/common'
import { StatsService } from './stats.service.js'
import { StatsController } from './stats.controller.js'
import { MutexModule } from '../../../core/util/mutex/mutex.module.js'
import { PrismaModule } from '../../../core/database/prisma.module.js'

@Module({
    imports: [MutexModule, PrismaModule],
    controllers: [StatsController],
    providers: [StatsService],
})
export class StatsModule {}
