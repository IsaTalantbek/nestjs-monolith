import { Injectable } from '@nestjs/common'

interface BlockedIp {
    locked: boolean
    lockTime: number // Время, когда блокировка была установлена
}

@Injectable()
export class IpAdressBlockService {
    private userLocks: Map<string, BlockedIp> = new Map()
    private cleanupInterval: NodeJS.Timeout

    constructor() {
        // Настроим периодическую очистку каждую минуту
        this.cleanupInterval = setInterval(() => this.cleanup(), 60000)
    }

    // Проверяем, есть ли блокировка для пользователя
    isLocked(ipAdress: string): boolean {
        const block = this.userLocks.get(ipAdress)
        return block ? block.locked : false
    }

    // Устанавливаем блокировку для пользователя
    lock(ipAdress: string): void {
        const currentTime = Date.now()
        this.userLocks.set(ipAdress, { locked: true, lockTime: currentTime })
    }

    // Снимаем блокировку для пользователя
    unlock(ipAdress: string): void {
        this.userLocks.set(ipAdress, { locked: false, lockTime: 0 })
    }

    // Метод для очистки мусора из карты
    private cleanup(): void {
        const currentTime = Date.now()
        const MINUTE = 10000 // 10 секунд в миллисекундах

        for (let [ip, block] of this.userLocks) {
            if (block.locked && currentTime - block.lockTime > MINUTE) {
                // Удаляем блокировки, которые действуют больше 10 секунд
                this.userLocks.delete(ip)
            }
        }
    }

    onModuleDestroy() {
        clearInterval(this.cleanupInterval)
    }
}
