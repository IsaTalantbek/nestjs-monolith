import { Module } from '@nestjs/common'
import { IpAdressBlockService } from './ip.adress.block.service.js'

@Module({
    providers: [IpAdressBlockService],
    exports: [IpAdressBlockService],
})
export class IpAdressBlockModule {}
