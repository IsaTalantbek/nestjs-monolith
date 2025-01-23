import { Module } from '@nestjs/common'
import { MutexService } from './mutex.service.js'

@Module({
    providers: [MutexService],
    exports: [MutexService],
})
export class MutexModule {}
