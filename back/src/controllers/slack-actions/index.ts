import * as Koa from 'koa'
import * as Router from 'koa-router'
import { Container } from 'typedi'
import { SlackLib } from '../../lib/slack/Slack'
import * as driver from '../driver'

export const init = (server: Koa) => {
  const router = new Router()
  const slackLib: SlackLib = Container.get(SlackLib)

  router.post('/slack/actions', slackLib.koaMiddleware())

  driver.init(slackLib.slackMessages)

  server.use(router.routes())
}
