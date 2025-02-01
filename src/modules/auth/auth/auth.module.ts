import { Module } from '@nestjs/common'
import { AuthService } from './auth.service.js'
import { AuthController } from './auth.controller.js'
import { MutexModule } from '../../../core/util/mutex/mutex.module.js'
import { IpAdressBlockModule } from '../../../core/util/ip-block/ip.adress.block.module.js'
import { PrismaModule } from '../../../core/database/prisma.module.js'
import { JwtAuthModule } from '../../../core/keys/jwt/jwt.auth.module.js'
import { SessionModule } from '../../../core/session/session.module.js'
import { CookieModule } from '../../../core/keys/cookie/cookie.module.js'

@Module({
    imports: [
        MutexModule,
        IpAdressBlockModule,
        PrismaModule,
        JwtAuthModule,
        SessionModule,
        CookieModule,
    ],
    controllers: [AuthController],
    providers: [AuthService],
})
export class AuthModule {}
