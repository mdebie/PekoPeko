import * as Koa from 'koa'
import * as Router from 'koa-router'
import { Container } from 'typedi'
import { HealthController } from './controller'

export const init = (server: Koa) => {
  const router = new Router()
  const controller: HealthController = Container.get(HealthController)

  router.get('/health', controller.get.bind(controller))

  server.use(router.routes())
}
