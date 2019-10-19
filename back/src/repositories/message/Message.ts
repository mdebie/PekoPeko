import { Service } from 'typedi'
import { SlackLib } from '../../lib/slack/Slack'
import { driverExists } from './driverExists.json'
import { initDriver } from './initDriver.json'
import { Message } from './MessageEntity'
import { thanks } from './thanks.json'

type MessageType = 'initDriver' | 'thanks' | 'driverExists'

@Service()
export class MessageRepository {
  private _switch: { [key: string]: any }

  constructor(private slack: SlackLib) {
    this._switch = {
      initDriver,
      thanks,
      driverExists
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
  public async postMessage(message: Message): Promise<void> {
    return this.slack.postMessage(message)
  }
}
