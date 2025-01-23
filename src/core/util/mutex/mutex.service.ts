import { Injectable } from '@nestjs/common'
import { Mutex } from 'async-mutex'

@Injectable()
export class MutexService {
    private locks: Map<string, Mutex> = new Map()

    // Метод для получения или создания мьютекса
    private getMutex(key: string): Mutex {
        if (!this.locks.has(key)) {
            this.locks.set(key, new Mutex())
        }
        return this.locks.get(key)!
    }

    // Универсальный метод для выполнения функции с блокировкой
    public async lock<T>(key: string, fn: () => Promise<T>): Promise<T> {
        const mutex = this.getMutex(key)
        const unlock = await mutex.acquire()
        try {
            return await fn() // Выполняем переданную функцию
        } finally {
            unlock() // Освобождаем блокировку
            if (!mutex.isLocked()) {
                this.locks.delete(key)
            }
        }
    }
}
