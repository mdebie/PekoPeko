import { AppError } from './AppError'

/**
 * NotFoundError
 *
 * @export
 * @class NotFoundError
 * @extends {AppError}
 */
export class NotFoundError extends AppError {
  constructor(message: string, error?: Error) {
    super(404, message, error)
  }
}
