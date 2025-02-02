import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class JwtAuthSettings {
    constructor(private readonly configService: ConfigService) {}

    get accessSecret(): string {
        return this.configService.get<string>('JWT_ACCESS_SECRET')
    }

    get refreshSecret(): string {
        return this.configService.get<string>('JWT_REFRESH_SECRET')
    }

    get accessExpire(): { expiresIn: number } {
        return {
            expiresIn: Number(
                this.configService.get<number>('JWT_ACCESS_EXPIRE')
            ),
        } // 5m
    }

    get refreshExpire(): { expiresIn: number } {
        return {
            expiresIn: Number(
                this.configService.get<number>('JWT_REFRESH_EXPIRE')
            ),
        } // 7d
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
