import { Message } from './MessageEntity'

export const thanks = (): Message => {
  return {
    text:
      'Merci pour ta participation. Un message de rappel te sera envoyé à 11H50 pour aller chercher la commande ! Bonne journée !',
    response_type: 'ephemeral'
  }
}
