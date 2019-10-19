import { Message } from './MessageEntity'

export const driverExists = (driver: string): Message => {
  return {
    text: `Oups, il semblerait que <@${driver}> se soit déjà proposé pour conduire`,
    response_type: 'ephemeral'
  }
}
