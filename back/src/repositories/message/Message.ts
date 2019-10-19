import { Service } from 'typedi'
import { SlackLib } from '../../lib/slack/Slack'
import { initDriver } from './initDriver.json'
import { Message } from './MessageEntity'

type MessageType = 'initDriver'

@Service()
export class MessageRepository {
  private _switch: { [key: string]: any }

  constructor(private slack: SlackLib) {
    this._switch = {
      initDriver
    }
  }

  /**
   * Gets a random message for the given messageName.
   * A message is made of an array of Block.
   * @param {MessageType} messageName
   * @param args Additional arguments to use in message
   */
  public getMessage(messageName: MessageType, ...args: any[]): Message {
    const message = this._switch[messageName](...args)
    return message
  }

  /**
   * Post a message to all users in channel
   * @param message
   */
  public async postMessage(message: Message): Promise<boolean> {
    return this.slack.postMessage(message)
  }
}
