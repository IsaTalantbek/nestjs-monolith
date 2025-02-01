import {
    CanActivate,
    NestInterceptor,
    PipeTransform,
    Type,
} from '@nestjs/common'

// Интерфейс для описания элемента декоратора
export interface DecoratorItem {
    use: Type<CanActivate> | Type<PipeTransform> | Type<NestInterceptor> // Тип элемента (гвард, пайп или интерцептор)
    key?: string // Ключ метаданных
    metadata?: any // Значение метаданных
}

// Интерфейс для опций декоратора Use
export interface UseDecoratorOptions {
    guards?: (DecoratorItem | Type<CanActivate>)[] // Массив гвардов
    pipes?: (DecoratorItem | Type<PipeTransform>)[] // Массив пайпов
    interceptors?: (DecoratorItem | Type<NestInterceptor>)[] // Массив интерцепторов
}
