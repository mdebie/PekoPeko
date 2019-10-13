const _ = process.env

export const serverConfig = {
  logLevel: _.LOG_LEVEL,
  server: {
    port: _.SERVER_PORT
  }
}
