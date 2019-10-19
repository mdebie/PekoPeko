import { Service } from 'typedi'
import { MessageRepository } from '../repositories/message/Message'

type ResponseType = 'initDriver'

@Service()
export class DriverManager {
  constructor(private messageRepository: MessageRepository) {}

  public async sendInitDriverMessage(): Promise<boolean> {
    const message = this.messageRepository.getMessage('initDriver')
    return this.messageRepository.postMessage(message)
  }
}
