import { SetMetadata } from '@nestjs/common'

export const LOGGING_FILE = 'logging_file'

// Дает метаданные для глобального интерсептора логгирования, а именно название файла для записи
// Если нету названия, то по дефолту записывает только ошибки+
export function Log(fileName: string = `errors`) {
    return SetMetadata(
        LOGGING_FILE,
        `${process.env.DEFAULT_LOG_FILE}/${fileName}.log`
    )
}
