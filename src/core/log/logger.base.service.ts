import { FastifyRequest } from 'fastify'
import { FastifyRequestType } from 'fastify/types/type-provider'
import { RequestUserInterface } from '../../types/types.js'

export interface RequestSample {
    filename: string | 'undefined'
    start: string
    url: string
    method: string
    user: RequestUserInterface['user'] | 'undefined'
    cookies: FastifyRequest['cookies'] | 'undefined'
    params: FastifyRequestType['params'] | 'undefined'
    body: FastifyRequestType['body'] | 'undefined'
    query: FastifyRequestType['query'] | 'undefined'
}

export interface ResponseSample {
    result: any
    end: string
}

export interface ErrorSample {
    error: string | 'undefined'
    stack: string | 'undefined'
    end: string
}
export interface SuccessLog extends RequestSample, ResponseSample {}
export interface ErrorLog extends RequestSample, ErrorSample {}

export abstract class LoggerService {
    protected safeJSON(obj: object | any): any {
        try {
            if (typeof obj !== 'object') {
                return obj
            }
            return JSON.stringify(obj, null, 2)
        } catch {
            return false
        }
    }

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
            user:
                request.user !== undefined && request.user !== null
                    ? request.user
                    : 'undefined',
            cookies:
                request.cookies !== undefined && request.cookies !== null
                    ? request.cookies
                    : 'undefined',
            params:
                request.params !== undefined && request.params !== null
                    ? request.params
                    : 'undefined',
            body:
                request.body !== undefined && request.body !== null
                    ? request.body
                    : 'undefined',
            query:
                request.query !== undefined && request.query !== null
                    ? request.query
                    : 'undefined',
        }
    }

    protected giveResponseSample(
        result: any,
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
        result: any,
        requestDATE?: string,
        resultDATE?: string,
        filename?: string
    ): SuccessLog {
        const requestLog = this.giveRequestSample(
            request,
            requestDATE,
            filename
        )
        const responseLog = this.giveResponseSample(result, resultDATE)
        return { ...requestLog, ...responseLog }
    }

    public createErrorLog(
        request: FastifyRequest,
        error: Error,
        requestDATE?: string,
        errorDATE?: string,
        filename?: string
    ): ErrorLog {
        const requestLog = this.giveRequestSample(
            request,
            requestDATE,
            filename
        )
        const errorLog = this.giveErrorSample(error, errorDATE)
        return { ...requestLog, ...errorLog }
    }
}
