import { Context } from 'koa'
import { Service } from 'typedi'
import { DriverManager } from '../../managers/Driver'

@Service()
export class InitController {
  constructor(private manager: DriverManager) {}

  public async init(ctx: Context) {
    const response = await this.manager.sendInitDriverMessage()
    ctx.body = response ? 'Ok' : 'Ok but not processed'
    ctx.status = 200
  }
}
