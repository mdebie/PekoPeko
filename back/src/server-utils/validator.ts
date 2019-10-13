import * as Joi from '@hapi/joi'
import { Context } from 'koa'
import { IMiddleware } from 'koa-router'
import { FieldError, FieldValidationError } from './ValidationError'

/**
 * Defiends a schema map that will be used to validate fields for the requests
 *
 * @export
 * @interface SchemaMap
 */
export interface SchemaMap {
  params?: { [key: string]: Joi.SchemaLike }

  request?: {
    body?: { [key: string]: Joi.SchemaLike } | Joi.ArraySchema | Joi.Schema
    headers?: { [key: string]: Joi.SchemaLike }
  }

  response?: {
    body?: { [key: string]: Joi.SchemaLike } | Joi.ArraySchema
    headers?: { [key: string]: Joi.SchemaLike }
  }
}

/**
 * Joi Validation middleware
 * @param schema
 */
export function validator(schema: SchemaMap): IMiddleware {
  return async (ctx: Context, next: () => Promise<any>) => {
    const result = Joi.validate(ctx, schema, {
      allowUnknown: true,
      abortEarly: false
    })

    if (result.error) {
      throw new FieldValidationError(
        result.error.message,
        result.error.details.map((e: FieldError) => ({
          message: e.message,
          path: e.path,
          type: e.type
        })),
        result.error
      )
    }

    await next()
  }
}
