const _ = process.env

export const serverConfig = {
  logLevel: _.LOG_LEVEL,
  server: {
    port: _.SERVER_PORT
  }
}

export const slackConfig = {
  token: _.SLACK_TOKEN,
  channel: _.SLACK_CHANNEL,
  signingSecret: _.SLACK_SIGNING_SECRET
}
