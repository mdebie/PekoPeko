import { Service } from 'typedi'
import { DriverRepository } from '../repositories/driver/Driver'
import { MessageRepository } from '../repositories/message/Message'
import { Message } from '../repositories/message/MessageEntity'
import { MessageError } from '../server-utils/MessageError'

@Service()
export class DriverManager {
  constructor(
    private messageRepository: MessageRepository,
    private driverRepository: DriverRepository
  ) {}

  /**
   * @todo fetch and use Item to get a complete message
   *
   * @returns {Promise<Message>}
   * @memberof DriverManager
   */
  public async sendInitDriverMessage(): Promise<Message> {
    const message = this.messageRepository.getMessage('initDriver', [], null)
    await this.messageRepository.postMessage(message)
    return message
  }

  public async setDriver(driverId: string): Promise<Message> {
    // 1. Verify that there's no current driver
    const currentDriver = await this.driverRepository.getTodaysDriver()
    // 1.1 If current driver then throw error
    if (currentDriver) {
      throw new MessageError(
        'Driver already exists',
        this.messageRepository.getMessage('driverExists', driverId)
      )
    }

    // 2. Save driver in DB
    await this.driverRepository.setTodaysDriver({
      id: driverId
    })

    // 3. Get updated init message
    const updatedInitMessage = this.messageRepository.getMessage(
      'initDriver',
      [],
      null,
      `<@${driverId}>`
    )

    return updatedInitMessage
  }
}
