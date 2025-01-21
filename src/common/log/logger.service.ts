import { ExecutionContext, Injectable } from '@nestjs/common'
import * as fs from 'fs/promises'

@Injectable()
export class LoggerService {
    async logToFile(message: string, logPath: string): Promise<void> {
        try {
            await fs.appendFile(logPath, message)
        } catch (fileError) {
            console.error('Failed to write log:', fileError)
        }
    }

    async logError(message: string): Promise<void> {
        try {
            await fs.appendFile('./messages/logs/errors.log', message)
        } catch (error) {
            console.error('Failed to write log:', error)
        }
    }
    async createErrorLogEntry(
        error: any,
        context: ExecutionContext,
        DATE: string
    ): Promise<void> {
        const request = context.switchToHttp().getRequest()
        const errorLog = `
--- START ${DATE} ---
    
- Request -
URL: ${request.url}
Method: ${request.method}
User: ${JSON.stringify(request.user)} 
Headers: ${JSON.stringify(request.headers.cookie)} 
Params: ${JSON.stringify(request.params)} 
Body: ${JSON.stringify(request.body)} 
Query: ${JSON.stringify(request.query)} 
    
- Error -
Message: ${error.message || 'Unknown error'}
Stack: ${error.stack || 'No stack trace'}
    
--- END ${new Date().toISOString()} ---
    `
        await this.logError(errorLog)
    }
}
