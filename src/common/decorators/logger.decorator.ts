import { SetMetadata } from '@nestjs/common'

export const LOG_CONSTANT = 'logging_file'

// Дает метаданные для глобального интерцептора логгирования, а именно название файла для записи
// Если нету названия, то по дефолту записывает только ошибки
export function Log(fileName: string = 'errors') {
    return SetMetadata(
        LOG_CONSTANT,
        `${process.env.DEFAULT_LOG_FILE}/${fileName}.log`
    )
}
