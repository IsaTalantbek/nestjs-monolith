import { Module } from '@nestjs/common'
import { SupportController } from './support.controller'
import { SupportService } from './support.service'
import { AuthPackModule } from 'src/auth.pack.module'

@Module({
    imports: [AuthPackModule],
    controllers: [SupportController],
    providers: [SupportService],
})
export class SupportModule {}
