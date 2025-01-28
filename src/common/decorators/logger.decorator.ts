import { SetMetadata } from '@nestjs/common'

export const LOG_CONSTANT = 'logging_file'

interface LogDecorator {
    filename?: string
    silent?: boolean
}

// Дает метаданные для глобального интерцептора логгирования, а именно название файла для записи
// Если нету названия, то по дефолту записывает только ошибки
export function Log({
    filename = 'default_log_file',
    silent = false,
}: LogDecorator = {}) {
    return SetMetadata(LOG_CONSTANT, {
        filename: filename,
        silent: silent,
    })
}
