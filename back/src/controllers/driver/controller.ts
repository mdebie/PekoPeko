import { Service } from 'typedi'
import { DriverManager } from '../../managers/Driver'
import { Message } from '../../repositories/message/MessageEntity'
import { MessageError } from '../../server-utils/MessageError'

@Service()
export class SlackEventsController {
  constructor(private manager: DriverManager) {}

  public async setDriver(payload: any, respond: (message: Message) => void) {
    const driverId = payload && payload.user && payload.user.id
    if (driverId) {
      try {
        const updatedInitMessage = await this.manager.setDriver(driverId)
        // Update init message
        updatedInitMessage.replace_original = true
        respond(updatedInitMessage)
      } catch (error) {
        if (error instanceof MessageError) {
          const errorMessage = error.additionalMessage
          errorMessage.replace_original = true
          errorMessage.response_type = 'ephemeral'
          respond(errorMessage)
        } else {
          respond({ text: 'Oups', response_type: 'ephemeral' })
        }
      }
    }
  }
}
