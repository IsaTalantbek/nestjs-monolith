import { Module } from '@nestjs/common'
import { CookieService } from './cookie.service.js'

@Module({
    providers: [CookieService],
    exports: [CookieService],
})
export class CookieModule {}
