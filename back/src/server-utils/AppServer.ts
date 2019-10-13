import { ErrorCallback, retry } from 'async'
import { Server } from 'http'
import * as Koa from 'koa'
import { Logger } from 'pino'

export class AppServer {
  private _server: Server

  constructor(
    private app: Koa,
    private logger: Pick<Logger, 'info' | 'error'>
  ) {}

  /**
   * Returns the current server
   *
   * @returns {Server}
   * @memberof AppServer
   */
  get server(): Server {
    return this._server
  }

  /**
   * Returns the current app
   *
   * @returns {Koa}
   * @memberof AppServer
   */
  get instance(): Koa {
    return this.app
  }

  /**
   * Listen to a defined port for requests
   *
   * @param {number} port
   * @returns {Server}
   * @memberof AppServer
   */
  public listen(port: number): Server {
    this.logger.info('Starting HTTP server')
    this._server = this.app.listen(port, () => {
      this.logger.info(`Application running on port: ${port}`)
    })
    return this._server
  }

  public closeServer(): Promise<void> {
    if (this.server === undefined) {
      throw new Error('Server is not initialized.')
    }

    const checkPendingRequests = (
      callback: ErrorCallback<Error | undefined>
    ) => {
      this.server.getConnections(
        (err: Error | null, pendingRequests: number) => {
          if (err) {
            callback(err)
          } else if (pendingRequests > 0) {
            callback(Error(`Number of pending requests: ${pendingRequests}`))
          } else {
            callback(undefined)
          }
        }
      )
    }

    return new Promise<void>((resolve, reject) => {
      retry(
        { times: 10, interval: 1000 },
        checkPendingRequests.bind(this),
        ((error: Error | undefined) => {
          if (error) {
            this.server.close(() => reject(error))
          } else {
            this.server.close(() => resolve())
          }
        }).bind(this)
      )
    })
  }

  public registerProcessEvents() {
    process.on('uncaughtException', (error: Error) => {
      this.logger.error('UncaughtException', error)
    })

    process.on('unhandledRejection', (reason: any, promise: any) => {
      this.logger.info(reason, promise)
    })

    process.on('SIGINT', async () => {
      await this.gracefulShutdown()
    })

    process.on('SIGTERM', async () => {
      await this.gracefulShutdown()
    })
  }

  public async gracefulShutdown() {
    this.logger.info('Starting graceful shutdown')

    let exitCode = 0
    const shutdown = [this.closeServer()]

    for (const s of shutdown) {
      try {
        await s
      } catch (e) {
        this.logger.error('Error in graceful shutdown ', e)
        exitCode = 1
      }
    }

    process.exit(exitCode)
  }
}
