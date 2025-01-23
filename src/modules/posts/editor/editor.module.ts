import { Module } from '@nestjs/common'
import { EditorService } from './editor.service.js'
import { EditorController } from './editor.controller.js'
import { MutexModule } from '../../../core/util/mutex/mutex.module.js'
import { PrismaModule } from '../../../core/database/prisma.module.js'

@Module({
    imports: [MutexModule, PrismaModule],
    controllers: [EditorController],
    providers: [EditorService],
})
export class EditorModule {}
