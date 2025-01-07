import { Module } from '@nestjs/common'
import { PrismaService } from '../../../core/database/prisma.service'
import { EditorService } from './editor.service'
import { EditorController } from './editor.controller'
import { JwtService } from 'src/core/keys/jwt/jwt.service'
import { JwtAuthSettings } from 'src/core/keys/jwt/jwt.auth.settings'

@Module({
    imports: [],
    providers: [EditorService, PrismaService, JwtService, JwtAuthSettings],
    controllers: [EditorController],
})
export class EditorModule {}
