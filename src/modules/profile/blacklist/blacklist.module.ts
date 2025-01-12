import { Module } from '@nestjs/common'
import { BlackLIstService } from './blacklist.service.js'
import { BlackListController } from './blacklist.controller.js'
import { AuthPackModule } from '../../../auth.pack.module.js'

@Module({
    imports: [AuthPackModule],
    controllers: [BlackListController],
    providers: [BlackLIstService],
})
export class BlackListModule {}
