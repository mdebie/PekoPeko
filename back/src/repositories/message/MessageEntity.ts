import { Block } from '@slack/types'

// https://api.slack.com/docs/interactive-message-field-guide#top-level_message_fields
export interface Message {
  text: string

  // in_channel by default.
  response_type?: 'in_channel' | 'ephemeral'

  replace_original?: boolean

  blocks?: Block[]

  link_names?: boolean
}
