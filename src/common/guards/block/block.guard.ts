import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common'
import { Observable } from 'rxjs'
import { IpAdressBlockManager } from '../../util/block.manager'

@Injectable()
export class IpAdressGuard implements CanActivate {
    constructor(private readonly blockManager: IpAdressBlockManager) {}

    canActivate(
        context: ExecutionContext
    ): boolean | Promise<boolean> | Observable<boolean> {
        const reply = context.switchToHttp().getResponse()
        const request = context.switchToHttp().getRequest()
        const ipAdress = request.ip // Предполагаем, что пользователь уже аутентифицирован

        // Если запрос блокирован, отклоняем новый
        if (this.blockManager.isLocked(ipAdress)) {
            reply.stats(400).send({ message: 'Ваш запрос обрабатывается' })
            return false // отклонить запрос
        }

        // Иначе разрешаем продолжить
        this.blockManager.lock(ipAdress)
        return true
    }
}
