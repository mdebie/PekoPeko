import {
  Block,
  ContextBlock,
  DividerBlock,
  ImageBlock,
  SectionBlock
} from '@slack/types'
import { Item } from '../../entities/Item'
import { Message } from './MessageEntity'

export const initDriver = (
  items: Item[] = [],
  highlightItem: Item
): Message => {
  let fields = {}
  if (Array.isArray(items) && items.length) {
    fields = {
      fields: items.map(i => {
        return {
          text: `*${i.label}* (${i.price})`,
          type: 'mrkdwn'
        }
      })
    }
  }
  const imageBlock: Block[] = []
  if (highlightItem && highlightItem.imageUrl) {
    imageBlock.push({
      type: 'image',
      title: {
        type: 'plain_text',
        text: highlightItem ? highlightItem.label : 'Plat du jour',
        emoji: true
      },
      image_url: highlightItem.imageUrl,
      alt_text: highlightItem ? highlightItem.label : 'Plat du jour'
    } as ImageBlock)
  }
  return {
    text: 'bla',
    blocks: [
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `It's PekoPeko time ! Au menu cette semaine :`
        },
        ...fields
      } as SectionBlock,
      {
        type: 'divider'
      } as DividerBlock,
      ...imageBlock,
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text:
            '*Un chauffeur ! Un chauffeur ! Mon royaume pour un chauffeur !*'
        },
        accessory: {
          type: 'button',
          text: {
            type: 'plain_text',
            text: 'Je serai votre chauffeur'
          },
          style: 'primary',
          confirm: {
            title: {
              text: "Votre mission si vous l'acceptez",
              type: 'plain_text'
            },
            confirm: {
              text: 'Accepter',
              type: 'plain_text'
            },
            deny: {
              text: 'Annuler',
              type: 'plain_text'
            },
            text: {
              text:
                "Aller chercher la commande de tout le monde ce midi. :truck: Attention c'est une mission dangereuse, le sort de collègues affamés est entre vos mains ! :warning:",
              type: 'mrkdwn'
            }
          },
          value: 'user_accepted_drive'
        }
      } as SectionBlock,
      {
        type: 'context',
        elements: [
          {
            type: 'mrkdwn',
            text: 'Pour commander, utilisez `/peko`'
          }
        ]
      } as ContextBlock
    ]
  }
}
