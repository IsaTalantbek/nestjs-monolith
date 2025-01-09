import {
    PipeTransform,
    Injectable,
    ArgumentMetadata,
    BadRequestException,
} from '@nestjs/common'

@Injectable()
export class ParamUuidPipe implements PipeTransform {
    async transform(value: string, metadata: ArgumentMetadata) {
        const uuidPattern = /^[a-f0-9]{8}-([a-f0-9]{4}-){3}[a-f0-9]{12}$/i

        // Если значение не соответствует формату UUID v4
        if (!uuidPattern.test(value)) {
            throw new BadRequestException('Invalid UUID format')
        }

        return value
    }
}
