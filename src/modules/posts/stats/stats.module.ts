import { Module } from '@nestjs/common'
import { AuthPackModule } from '../../../auth.pack.module.js'
import { StatsService } from './stats.service.js'
import { StatsController } from './stats.controller.js'

@Module({
    imports: [AuthPackModule],
    controllers: [StatsController],
    providers: [StatsService],
})
export class StatsModule {}
