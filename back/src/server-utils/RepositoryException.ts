export class RepositoryException extends Error {
  constructor(message?: string, public innerException?: any) {
    super(message)
  }
}
