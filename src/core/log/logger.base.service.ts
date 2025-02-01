import { FastifyRequest } from 'fastify'
import {
    ErrorLog,
    ErrorSample,
    RequestSample,
    ResponseSample,
    SuccessLog,
} from './log.interface.js'

export abstract class LoggerService {
    //protected safeJSON(obj: object | any): any {
    //    try {
    //        if (typeof obj !== 'object') {
    //            return obj
    //        }
    //        return JSON.stringify(obj, null, 2)
    //    } catch {
    //        return false
    //    }
    //}

    protected giveRequestSample(
        request: FastifyRequest,
        requestDATE?: string,
        filename?: string
    ): RequestSample {
        return {
            filename: filename || 'undefined',
            start: requestDATE || new Date().toISOString(),
            url: request.url,
            method: request.method,
            user: request.user || 'undefined',
            cookies: request.cookies || {},
            params: request.params || {},
            body: request.body || {},
            query: request.query || {},
        }
    }

    protected giveResponseSample(
        result: 'secret' | any,
        resultDATE?: string
    ): ResponseSample {
        return {
            result: result,
            end: resultDATE || new Date().toISOString(),
        }
    }

    protected giveErrorSample(err: Error, errorDATE?: string): ErrorSample {
        return {
            error: err.message || 'undefined',
            stack: err.stack || 'undefined',
            end: errorDATE || new Date().toISOString(),
        }
    }

    public createSuccessLog(
        request: FastifyRequest,
        result: 'secret' | any,
        requestDATE?: string,
        resultDATE?: string,
        filename?: string
    ): SuccessLog {
        const requestLog: RequestSample = this.giveRequestSample(
            request,
            requestDATE,
            filename
        )
        const responseLog: ResponseSample = this.giveResponseSample(
            result,
            resultDATE
        )
        return { request: requestLog, response: responseLog }
    }

    public createErrorLog(
        request: FastifyRequest,
        error: Error,
        requestDATE?: string,
        errorDATE?: string,
        filename?: string
    ): ErrorLog {
        const requestLog: RequestSample = this.giveRequestSample(
            request,
            requestDATE,
            filename
        )
        const errorLog: ErrorSample = this.giveErrorSample(error, errorDATE)
        return { request: requestLog, error: errorLog }
    }
}
