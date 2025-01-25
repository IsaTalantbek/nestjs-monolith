import { Module } from '@nestjs/common'
import { BlacklistService } from './blacklist.service.js'
import { BlackListController } from './blacklist.controller.js'
import { PrismaModule } from '../../../core/database/prisma.module.js'
import { MutexModule } from '../../../core/util/mutex/mutex.module.js'

@Module({
    imports: [PrismaModule, MutexModule],
    controllers: [BlackListController],
    providers: [BlacklistService],
})
export class BlackListModule {}
