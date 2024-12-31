import { Injectable } from '@nestjs/common'
import { CanActivate, ExecutionContext } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'

@Injectable()
export class jwtGuard implements CanActivate {
    constructor(private readonly jwtService: JwtService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest()
        const token = request.cookies?.aAuthToken

        if (token) {
            try {
                const decoded = await this.jwtService.verifyAsync(token)
                request.user = decoded
            } catch (error) {
                console.error('Token invalid or expired', error)
            }
        }
        return true
    }
}
