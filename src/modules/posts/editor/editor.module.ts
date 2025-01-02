import { Module } from '@nestjs/common'
import { PrismaService } from '../../../core/database/prisma.service'
import { EditorService } from './editor.service'
import { EditorCoontroller } from './editor.controller'
import { JwtCheck } from 'src/common/guards/jwt.check'
import { JwtTokenService } from 'src/core/keys/jwt.service'

@Module({
    imports: [],
    providers: [EditorService, PrismaService, JwtCheck, JwtTokenService],
    controllers: [EditorCoontroller],
})
export class EditorModule {}
