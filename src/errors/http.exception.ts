export class HttpException extends Error {
  constructor(
    public name: string,
    public message: string,
    public status: number
  ) {
    super(message);
    this.name = name;
    this.status = status;

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, HttpException);
    }
  }
}
