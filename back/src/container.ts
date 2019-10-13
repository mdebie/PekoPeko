import * as pino from 'pino'
import { Container } from 'typedi'
import { serverConfig } from './config'

export async function createContainer() {
  // Init Logger
  Container.set('Logger', pino({ level: serverConfig.logLevel || 'trace' }))
}
