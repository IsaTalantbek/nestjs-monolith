import { SetMetadata } from '@nestjs/common'

export const LOGGING_FILE = 'logging_file'

export function Log(fileName?: string) {
    return fileName
        ? SetMetadata(
              LOGGING_FILE,
              `${process.env.DEFAULT_LOG_FILE}/${fileName}.log`
          )
        : SetMetadata(
              LOGGING_FILE,
              `${process.env.DEFAULT_LOG_FILE}/errors.log`
          )
}
