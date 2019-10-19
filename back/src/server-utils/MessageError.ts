import { Message } from '../repositories/message/MessageEntity'

/**
 * MessageError
 *
 * @export
 * @class MessageError
 * @extends {Error}
 */
export class MessageError extends Error {
  constructor(public message: string, public additionalMessage: Message) {
    super(message)
  }
}
