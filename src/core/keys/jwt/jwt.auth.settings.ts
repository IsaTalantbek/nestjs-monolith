import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class JwtAuthSettings {
    constructor(private readonly configService: ConfigService) {}

    get accessSecret(): string {
        return this.configService.get<string>('JWT_SECRET')
    }

    get refreshSecret(): string {
        return this.configService.get<string>('JWT_REFRESH_SECRET')
    }

    get accessExpire(): { expiresIn: string } {
        return { expiresIn: '5m' }
    }

    get refreshExpire(): { expiresIn: string } {
        return { expiresIn: '7d' }
    }

    // Методы для возврата всех настроек сразу
    accessOptions() {
        return {
            secret: this.accessSecret,
            ...this.accessExpire,
        }
    }

    refreshOptions() {
        return {
            secret: this.refreshSecret,
            ...this.refreshExpire,
        }
    }
}
