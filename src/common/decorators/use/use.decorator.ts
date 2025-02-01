import {
    applyDecorators,
    UseGuards,
    UseInterceptors,
    UsePipes,
    SetMetadata,
    Type,
    PipeTransform,
    CanActivate,
    NestInterceptor,
} from '@nestjs/common'
import { DecoratorItem, UseDecoratorOptions } from './use.interface.js'

// Функция для создания массива декораторов
function createDecoratorArray(
    items: (
        | DecoratorItem
        | Type<CanActivate>
        | Type<PipeTransform>
        | Type<NestInterceptor>
    )[],
    decoratorFn: Function
) {
    return items.flatMap((item) => {
        if (typeof item === 'function') {
            return [decoratorFn(item)]
        } else {
            const { use, key, metadata } = item
            return [
                decoratorFn(use), // Применение декоратора (гвард, пайп или интерцептор)
                key ? SetMetadata(key, metadata) : undefined, // Установка метаданных, если они есть
            ].filter(Boolean)
        }
    })
}

// Основная функция-декоратор Use
export function Use(options: UseDecoratorOptions) {
    const { guards = [], pipes = [], interceptors = [] } = options

    const decorators = []

    // Добавление гвардов
    if (guards.length) {
        decorators.push(...createDecoratorArray(guards, UseGuards))
    }

    // Добавление пайпов
    if (pipes.length) {
        decorators.push(...createDecoratorArray(pipes, UsePipes))
    }

    // Добавление интерцепторов
    if (interceptors.length) {
        decorators.push(...createDecoratorArray(interceptors, UseInterceptors))
    }

    // Применение всех декораторов
    return applyDecorators(...decorators)
}
