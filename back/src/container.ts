import * as pino from 'pino'
import { Container } from 'typedi'
import { serverConfig, slackConfig } from './config'
import { SlackLib } from './lib/slack/Slack'

export async function createContainer() {
  // Init Logger
  Container.set('Logger', pino({ level: serverConfig.logLevel || 'trace' }))

  const slackLib = new SlackLib(slackConfig)
  Container.set(SlackLib, slackLib)
}
