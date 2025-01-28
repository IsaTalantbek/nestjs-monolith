export enum SGM { // Session Guard Metadata
    unauthorized = 'unauthorized', // Only unauthorized // Только не авторизованным
    authorized = 'authorized', // Only authorized // Только авторизованным
    check = 'check', // Session Check // Только проверка сессии
}
