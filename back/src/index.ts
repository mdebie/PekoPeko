import 'reflect-metadata'

// tslint:disable-next-line: no-var-requires
require('dotenv').config()

import { Logger } from 'pino'
import { Container } from 'typedi'
import { serverConfig } from './config'
import { createServer } from './server'

export async function init() {
  try {
    const port = Number(serverConfig.server.port) || 8080
    const app = await createServer()

    app.listen(port)
    app.registerProcessEvents()
  } catch (e) {
    Container.get<Logger>('Logger').error(
      e,
      'An error occurred while initializing application.'
    )
  }
}

init()
