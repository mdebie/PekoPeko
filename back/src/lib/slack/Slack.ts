import { ChatPostMessageArguments, WebClient } from '@slack/web-api'
import { Message } from '../../repositories/message/MessageEntity'
import { RepositoryException } from '../../server-utils/RepositoryException'

interface Options {
  token: string
  channel: string
}

export class SlackLib {
  private client: WebClient

  constructor(private options: Options) {
    if (!options.token || !options.channel) {
      throw new RepositoryException('Slack API config is invalid')
    }
    this.client = new WebClient(options.token)
  }

  public async postMessage(message: Message): Promise<boolean> {
    try {
      const request: ChatPostMessageArguments = {
        channel: this.options.channel,
        ...message
      }
      const result = await this.client.chat.postMessage(request)
      if (result.error) {
        throw new RepositoryException(
          'Slack API postMessage Error',
          result.error
        )
      }
      return result.ok
    } catch (error) {
      throw new RepositoryException('Slack API postMessage Error', error)
    }
  }
}
