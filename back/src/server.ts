import * as cors from '@koa/cors'
import * as Koa from 'koa'
import * as bodyParser from 'koa-bodyparser'
import * as helmet from 'koa-helmet'
import koa_response_time = require('koa-response-time')
import { Logger } from 'pino'
import { Container } from 'typedi'
import { createContainer } from './container'
import * as initHealth from './controllers/health'
import { AppServer } from './server-utils/AppServer'
import { errorHandler } from './server-utils/error-handler'

/**
 * Creates a server instance
 *
 * @export
 * @returns {AppServer}
 */
export async function createServer(): Promise<AppServer> {
  await createContainer()

  const logger = Container.get<Logger>('Logger')

  const app: Koa = new Koa()
    .use(koa_response_time())
    .use(helmet())
    .use(cors())
    .use(bodyParser())
    .use(errorHandler(logger))

  initHealth.init(app)

  return new AppServer(app, logger)
}
