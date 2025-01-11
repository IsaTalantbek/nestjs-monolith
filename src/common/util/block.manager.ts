import { Injectable } from '@nestjs/common'

@Injectable()
export class IpAdressBlockManager {
    private userLocks: Map<string, boolean> = new Map()

    // Проверяем, есть ли блокировка для пользователя
    isLocked(ipAdress: string): boolean {
        return this.userLocks.get(ipAdress) || false
    }

    // Устанавливаем блокировку для пользователя
    lock(ipAdress: string): void {
        this.userLocks.set(ipAdress, true)
    }

    // Снимаем блокировку для пользователя
    unlock(ipAdress: string): void {
        this.userLocks.set(ipAdress, false)
    }
}
