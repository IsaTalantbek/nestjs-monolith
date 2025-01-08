import { Module } from '@nestjs/common'
import { EditorService } from './editor.service'
import { EditorController } from './editor.controller'
import { AuthPackModule } from 'src/auth.pack.module'

@Module({
    imports: [AuthPackModule],
    controllers: [EditorController],
    providers: [EditorService],
})
export class EditorModule {}
