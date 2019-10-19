import * as Koa from 'koa'
import * as Router from 'koa-router'
import { Container } from 'typedi'
import { InitController } from './controller'

export const init = (server: Koa) => {
  const router = new Router()
  const controller: InitController = Container.get(InitController)

  router.get('/init', controller.init.bind(controller))

  server.use(router.routes())
}
