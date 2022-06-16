export class HttpException extends Error {
  constructor(
    public name: string,
    public message: string,
    public status: number,
    public info?: string[]
  ) {
    super(message);
    this.name = name;
    this.status = status;
    this.info = info;
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, HttpException);
    }
  }
}
