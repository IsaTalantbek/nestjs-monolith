import { Module } from '@nestjs/common'
import { BlackLIstService } from './blacklist.service'
import { BlackListController } from './blacklist.controller'
import { AuthPackModule } from 'src/auth.pack.module'

@Module({
    imports: [AuthPackModule],
    controllers: [BlackListController],
    providers: [BlackLIstService],
})
export class BlackListModule {}
