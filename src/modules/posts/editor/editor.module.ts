import { Module } from '@nestjs/common'
import { EditorService } from './editor.service.js'
import { EditorController } from './editor.controller.js'
import { AuthPackModule } from '../../../auth.pack.module.js'

@Module({
    imports: [AuthPackModule],
    controllers: [EditorController],
    providers: [EditorService],
})
export class EditorModule {}
