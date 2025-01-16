import { Module } from '@nestjs/common'
import { BlackLIstService } from './blacklist.service.js'
import { BlackListController } from './blacklist.controller.js'

@Module({
    controllers: [BlackListController],
    providers: [BlackLIstService],
})
export class BlackListModule {}
