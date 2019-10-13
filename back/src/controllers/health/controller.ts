import { Context } from 'koa'
import { Service } from 'typedi'

@Service()
export class HealthController {
  public get(ctx: Context) {
    ctx.body = `OK`
    ctx.status = 200
  }
}
