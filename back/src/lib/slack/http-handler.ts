import SlackMessageAdapter from '@slack/interactive-messages/dist/adapter'
import {
  ErrorCode,
  errorWithCode
} from '@slack/interactive-messages/dist/errors'
import { isFalsy } from '@slack/interactive-messages/dist/util'
import { createHmac } from 'crypto'
import { Context } from 'koa'
import * as querystring from 'querystring'
// tslint:disable-next-line: no-var-requires
const timingSafeCompare = require('tsscmp')

export function createHTTPHandler(adapter: SlackMessageAdapter) {
  /**
   * Handles sending responses
   *
   * @param res - Response object
   * @returns Returns a function used to send response
   */
  function sendResponse(ctx: Context) {
    return (_a: { status: number; content?: any }) => {
      const status = _a.status
      const content = _a.content
      ctx.status = status
      if (typeof content === 'string') {
        ctx.body = content
      } else if (!isFalsy(content)) {
        ctx.set('Content-Type', 'application/json')
        ctx.body = JSON.stringify(content)
      }
    }
  }
  /**
   * Parses raw bodies of requests
   *
   * @param body - Raw body of request
   * @returns Parsed body of the request
   */
  function parseBody(body: any) {
    const parsedBody = querystring.parse(body)
    if (!isFalsy(parsedBody.payload)) {
      return JSON.parse(parsedBody.payload as string)
    }
    return parsedBody
  }
  /**
   * Method to verify signature of requests
   *
   * @param signingSecret - Signing secret used to verify request signature
   * @param requestHeaders - The signing headers. If `req` is an incoming request, then this should be `req.headers`.
   * @param body - Raw body string
   * @returns Indicates if request is verified
   */
  function verifyRequestSignature(signingSecret: string, ctx: Context) {
    // Request signature
    const signature = ctx.request.headers['x-slack-signature']
    // Request timestamp
    const ts = parseInt(ctx.request.headers['x-slack-request-timestamp'], 10)
    // Divide current date to match Slack ts format
    // Subtract 5 minutes from current time
    const fiveMinutesAgo = Math.floor(Date.now() / 1000) - 60 * 5
    if (ts < fiveMinutesAgo) {
      throw errorWithCode(
        new Error('Slack request signing verification outdated'),
        ErrorCode.RequestTimeFailure
      )
    }
    const hmac = createHmac('sha256', signingSecret)
    const _a = signature.split('=')
    const version = _a[0]
    const hash = _a[1]
    hmac.update(version + ':' + ts + ':' + ctx.request.rawBody)
    if (!timingSafeCompare(hash, hmac.digest('hex'))) {
      throw errorWithCode(
        new Error('Slack request signing verification failed'),
        ErrorCode.SignatureVerificationFailure
      )
    }
    return true
  }
  /**
   * Request listener used to handle Slack requests and send responses and
   * verify request signatures
   */
  return (ctx: Context) => {
    // Function used to send response
    const respond = sendResponse(ctx)
    // If parser is being used and we don't receive the raw payload via `rawBody`,
    // we can't verify request signature
    if (!isFalsy(ctx.request.body) && isFalsy(ctx.request.rawBody)) {
      respond({
        status: 500,
        content:
          process.env.NODE_ENV === 'development'
            ? 'Parsing request body prohibits request signature verification'
            : undefined
      })
      return
    }
    if (isFalsy(ctx.request.rawBody)) {
      respond({ status: 500, content: 'rawBody not present on request' })
    }
    if (verifyRequestSignature(adapter.signingSecret, ctx)) {
      // Request signature is verified
      // Parse raw body
      const body = parseBody(ctx.request.rawBody)
      if (body.ssl_check) {
        respond({ status: 200 })
        return
      }
      const dispatchResult = adapter.dispatch(body)
      if (dispatchResult !== undefined) {
        // TODO: handle this after responding?
        dispatchResult.then(respond)
      } else {
        // No callback was matched
        respond({ status: 404 })
      }
    }
  }
}
