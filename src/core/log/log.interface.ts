import { FastifyRequest } from 'fastify'
import { RequestUserInterface } from '../../types/types.js'
import { FastifyRequestType } from 'fastify/types/type-provider.js'

export interface RequestSample {
    filename: string | 'undefined'
    start: string
    url: string
    method: string
    user: RequestUserInterface['user'] | 'undefined'
    cookies: Array<string> | 'undefined'
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
export interface SuccessLog {
    request: RequestSample
    response: ResponseSample
}
export interface ErrorLog {
    request: RequestSample
    error: ErrorSample
}
