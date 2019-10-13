import { Context, Response } from 'koa'
import { IMiddleware } from 'koa-router'
import { Logger } from 'pino'
import { AppError } from './AppError'
import { httpCodes } from './httpCodes'

export function errorHandler(logger: Logger): IMiddleware {
  function respondError(err: AppError, ctx: Context, data?: any) {
    const body = Object.assign(err.toModel(), {
      innerException: err.error && err.error.message,
      data
    })

    ctx.response.body = body
    ctx.response.status = err.code

    logError(ctx.response, body)
  }

  function logError(res: Response, body: any) {
    if (res.status >= 500) {
      logger.error(body)
    } else {
      logger.warn(body)
    }
  }

  return async (ctx: Context, next: () => Promise<any>) => {
    try {
      await next()
    } catch (err) {
      const errorType = err.constructor.name

      if (errorType === AppError.name || err instanceof AppError) {
        return respondError(err, ctx)
      }
      return respondError(new AppError(500, httpCodes[500], err), ctx)
    }
  }
}
