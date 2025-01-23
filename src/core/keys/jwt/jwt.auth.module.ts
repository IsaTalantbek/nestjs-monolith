import { Module } from '@nestjs/common'
import { JwtAuthSettings } from './jwt.auth.settings.js'
import { JwtAuthService } from './jwt.auth.service.js'

@Module({
    providers: [JwtAuthSettings, JwtAuthService],
    exports: [JwtAuthService],
})
export class JwtAuthModule {}
