import { Block } from '@slack/types'

export interface Message {
  text: string
  blocks?: Block[]
}
