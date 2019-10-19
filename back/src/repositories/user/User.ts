import { Service } from 'typedi'
import { SlackLib } from '../../lib/slack/Slack'
import { User } from './UserEntity'

@Service()
export class UserRepository {
  constructor(private slack: SlackLib) {}

  /**
   * Gets a Slack User information from a given user ID
   * @param {string} userId
   */
  public async getUserInfo(userId: string): Promise<User> {
    return await this.slack.getUser(userId)
  }
}
