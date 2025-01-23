import { Module } from '@nestjs/common'
import { BlackLIstService } from './blacklist.service.js'
import { BlackListController } from './blacklist.controller.js'
import { PrismaModule } from '../../../core/database/prisma.module.js'
import { MutexModule } from '../../../core/util/mutex/mutex.module.js'

@Module({
    imports: [PrismaModule, MutexModule],
    controllers: [BlackListController],
    providers: [BlackLIstService],
})
export class BlackListModule {}
