import { createMessageAdapter } from '@slack/interactive-messages'
import SlackMessageAdapter from '@slack/interactive-messages/dist/adapter'
import {
  ChatPostMessageArguments,
  UsersInfoArguments,
  WebClient
} from '@slack/web-api'
import { Context, Middleware } from 'koa'
import { Message } from '../../repositories/message/MessageEntity'
import { User } from '../../repositories/user/UserEntity'
import { RepositoryException } from '../../server-utils/RepositoryException'
import { createHTTPHandler } from './http-handler'

interface Options {
  token: string
  channel: string
  signingSecret: string
}

export class SlackLib {
  private _client: WebClient
  private _slackMessages: SlackMessageAdapter
  get slackMessages(): SlackMessageAdapter {
    return this._slackMessages
  }

  constructor(private options: Options) {
    if (!options.token || !options.channel) {
      throw new RepositoryException('Slack API config is invalid')
    }
    this._client = new WebClient(options.token)
    this._slackMessages = createMessageAdapter(options.signingSecret)
  }

  public async postMessage(message: Message): Promise<void> {
    try {
      const request: ChatPostMessageArguments = {
        channel: this.options.channel,
        ...message
      }
      const result = await this._client.chat.postMessage(request)
      if (result.error || !result.ok) {
        throw new RepositoryException(
          'Slack API postMessage Error',
          result.error
        )
      }
      return
    } catch (error) {
      throw new RepositoryException('Slack API postMessage Error', error)
    }
  }

  public async getUser(userId: string): Promise<User> {
    try {
      const request: UsersInfoArguments = {
        user: userId
      }
      const result = await this._client.users.info(request)
      if (result.error || !result.ok || !result.user) {
        throw new RepositoryException(
          'Slack API get user info Error',
          result.error
        )
      }
      return result.user as User
    } catch (error) {
      throw new RepositoryException('Slack API getUser Error', error)
    }
  }

  public koaMiddleware(): Middleware {
    const requestListener = createHTTPHandler(this._slackMessages)

    return async (ctx: Context, next: () => Promise<any>) => {
      requestListener(ctx)
      await next()
    }
  }
}
