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

    get accessExpire(): { expiresIn: number } {
        return { expiresIn: 300 } // 5m
    }

    get refreshExpire(): { expiresIn: number } {
        return { expiresIn: 604800 } // 7d
    }

    // Методы для возврата всех настроек сразу
    public accessOptions() {
        return {
            secret: this.accessSecret,
            ...this.accessExpire,
        }
    }

    public refreshOptions() {
        return {
            secret: this.refreshSecret,
            ...this.refreshExpire,
        }
    }
}
