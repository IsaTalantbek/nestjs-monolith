import { Module } from '@nestjs/common'
import { PrismaService } from '../../../core/database/prisma.service'
import { EditorService } from './editor.service'
import { EditorController } from './editor.controller'
import { JwtTokenService } from 'src/core/keys/jwt.service'

@Module({
    imports: [],
    providers: [EditorService, PrismaService, JwtTokenService],
    controllers: [EditorController],
})
export class EditorModule {}
