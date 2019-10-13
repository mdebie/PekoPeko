export class AppError extends Error {
  constructor(
    public code: number,
    public message: string,
    public error?: Error
  ) {
    super()
  }

  public toModel() {
    return {
      code: this.code,
      message: this.message,
      error: this.error ? this.error : ''
    }
  }
}
