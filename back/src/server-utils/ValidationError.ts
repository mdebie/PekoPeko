import { AppError } from './AppError'

/**
 * ValidationError
 *
 * @export
 * @class ValidationError
 * @extends {AppError}
 */
export class ValidationError extends AppError {
  constructor(message: string, error?: Error) {
    super(400, message, error)
  }
}

/**
 * Field error interface , used by validation
 *
 * @export
 * @interface FieldError
 */
export interface FieldError {
  message: string
  type: string
  path: string[]
}

/**
 * FieldValidationError
 *
 * @export
 * @class FieldValidationError
 * @extends {AppError}
 */
export class FieldValidationError extends AppError {
  public fields: FieldError[]

  constructor(message: string, fields: FieldError[], error?: Error) {
    super(400, message, error)
    this.fields = fields
  }

  public toModel() {
    return {
      code: this.code,
      message: this.message,
      fields: this.fields,
      error: this.error ? this.error : ''
    }
  }
}
