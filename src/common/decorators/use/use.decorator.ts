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

// Интерфейс для описания элемента декоратора
interface DecoratorItem {
    use: Type<CanActivate> | Type<PipeTransform> | Type<NestInterceptor> // Тип элемента (гвард, пайп или интерцептор)
    key?: string // Ключ метаданных
    metadata?: any // Значение метаданных
}

// Интерфейс для опций декоратора Use
interface UseDecoratorOptions {
    guards?: DecoratorItem[] | DecoratorItem['use'] // Массив гвардов
    pipes?: DecoratorItem[] | DecoratorItem['use'] // Массив пайпов
    interceptors?: DecoratorItem[] | DecoratorItem['use'] // Массив интерцепторов
}

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

function normalizeItems(items: DecoratorItem[] | DecoratorItem['use']) {
    return Array.isArray(items) ? items : [items]
}

// Основная функция-декоратор Use
export function Use(options: UseDecoratorOptions) {
    const { guards = [], pipes = [], interceptors = [] } = options

    const decorators = []

    // Добавление гвардов
    if (guards) {
        decorators.push(
            ...createDecoratorArray(normalizeItems(guards), UseGuards)
        )
    }

    // Добавление пайпов
    if (pipes) {
        decorators.push(
            ...createDecoratorArray(normalizeItems(pipes), UsePipes)
        )
    }

    // Добавление интерцепторов
    if (interceptors) {
        decorators.push(
            ...createDecoratorArray(
                normalizeItems(interceptors),
                UseInterceptors
            )
        )
    }

    // Применение всех декораторов
    return applyDecorators(...decorators)
}
