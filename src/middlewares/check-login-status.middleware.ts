import { plainToInstance } from "class-transformer";
import { NextFunction, Request, Response } from "express";
import { inject, injectable } from "inversify";
import { BaseMiddleware } from "inversify-express-utils";
import { TYPES } from "../core/types.core";
import { AuthService } from "../modules/auth/auth.service";
import { User } from "../modules/user/entity/user.entity";
import { UnauthorizedException } from "../shared/errors/all.exception";
import { JwtUtil } from "../shared/utils/jwt.util";
import { Logger } from "../shared/utils/logger.util";

@injectable()
export class CheckLoginStatus extends BaseMiddleware {
  constructor(
    @inject(TYPES.Logger)
    private readonly _logger: Logger,
    @inject(TYPES.JwtUtil) private readonly _jwtUtil: JwtUtil,
    @inject(TYPES.IAuthService) private readonly _authService: AuthService
  ) {
    super();
  }

  // 로그인 상태라면 req.user를 설정한다.
  public async handler(req: Request, res: Response, next: NextFunction) {
    try {
      this._logger.trace(`[CheckLoginStatus] start`);
      const AUTH_TYPE = "Bearer ";
      const header = req.headers.authorization;
      let accessToken;

      if (header && header.startsWith(AUTH_TYPE))
        accessToken = header.split(" ")[1];

      // accessToken이 없다면 미로그인 상태. next 호출
      if (!accessToken) {
        this._logger.trace(`[CheckLoginStatus] not logged in. call next`);
        return next();
      }

      // access token이 있다면 유효 여부 판단
      this._logger.trace(`[CheckLoginStatus] verify access token...`);
      let decoded = this._jwtUtil.verify(accessToken);
      if (decoded.status === "invalid") {
        this._logger.trace(`[CheckLoginStatus] jwt verify error`);
        throw new UnauthorizedException("authentication error");
      }
      if (decoded.status === "expired") {
        this._logger.trace(`[CheckLoginStatus] jwt expired`);
        throw new UnauthorizedException("access token expired");
      }

      // access token의 payload가 유효한 사용자 확인
      this._logger.trace(`[CheckLoginStatus] validate user with token...`);
      await this._authService.validateUserWithToken(
        decoded.id,
        decoded.nickname,
        decoded.mbti
      );

      req.user = plainToInstance(User, {
        id: decoded.id,
        nickname: decoded.nickname,
        mbti: decoded.mbti,
        isAdmin: decoded.isAdmin,
      });

      this._logger.trace(`[CheckLoginStatus] logged in. call next`);
      return next();
    } catch (err) {
      return next(err);
    }
  }
}
