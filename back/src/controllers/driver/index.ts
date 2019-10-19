import SlackMessageAdapter from '@slack/interactive-messages/dist/adapter'
import { Container } from 'typedi'
import { SlackActionEnum } from '../../lib/slack/actions.enum'
import { SlackEventsController } from './controller'

export const init = (slackEvents: SlackMessageAdapter) => {
  const controller: SlackEventsController = Container.get(SlackEventsController)

  slackEvents.action(
    {
      actionId: SlackActionEnum.user_accepted_drive
    },
    controller.setDriver.bind(controller)
  )
}
