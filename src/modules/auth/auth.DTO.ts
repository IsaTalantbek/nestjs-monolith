// create-user.dto.ts
import {
    IsString,
    Matches,
    IsEmail,
    MinLength,
    MaxLength,
} from 'class-validator'

export class CreateUserDto {
    @IsString()
    @MinLength(4) // минимум 4 символа
    @MaxLength(30) // максимум 30 символов
    @Matches(/^[a-zA-Zа-яА-Я0-9_-]+$/, {
        message:
            'Логин может содержать только латиницу, кириллицу, цифры, "-", "_" и не должен содержать пробелы.',
    }) // проверка на латиницу, кириллицу, цифры и спецсимволы "-"
    @Matches(/^\S.*\S$/, {
        message: 'Логин не должен содержать пробелы по бокам.',
    }) // регулярка для проверки пробелов по бокам
    login: string

    @IsEmail() // проверка на email
    email: string

    @IsString()
    @MinLength(8) // минимум 8 символов для пароля
    @MaxLength(50) // максимум 50 символов для пароля
    password: string
}

export class LoginUserDto {
    @Matches(/^[a-zA-Zа-яА-Я0-9_-]+$/, {
        message: 'Неправильный логин или пароль',
    }) // проверка на латиницу, кириллицу, цифры и спецсимволы "-"
    @Matches(/^\S.*\S$/, {
        message: 'Неправильный логин или пароль',
    })
    login: string
    password: string
}

export type registerForm = {
    login: string
    password: string
    email: string
}

export type loginForm = {
    login: string
    password: string
}
