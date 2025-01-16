import { Module } from '@nestjs/common'
import { EditorService } from './editor.service.js'
import { EditorController } from './editor.controller.js'

@Module({
    controllers: [EditorController],
    providers: [EditorService],
})
export class EditorModule {}
