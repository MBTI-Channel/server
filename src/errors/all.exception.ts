import { HttpException } from "./http.exception";

export class BadReqeustException extends HttpException {
  constructor(message: string) {
    super("BadReqeustException", message, 400);
  }
}

export class UnauthorizedException extends HttpException {
  constructor(message: string) {
    super("BadReqeustException", message, 401);
  }
}

export class ForbiddenException extends HttpException {
  constructor(message: string) {
    super("ForbiddenException", message, 403);
  }
}

export class NotFoundException extends HttpException {
  constructor(message: string) {
    super("NotFoundException", message, 404);
  }
}

export class ConflictException extends HttpException {
  constructor(message: string) {
    super("ConflictException", message, 409);
  }
}

export class InternalServerErrorException extends HttpException {
  constructor(message: string) {
    super("InternalServerErrorException", message, 500);
  }
}
