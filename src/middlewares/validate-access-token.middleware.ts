import { NextFunction, Request, Response } from "express";
import { inject, injectable } from "inversify";
import { BaseMiddleware } from "inversify-express-utils";
import { plainToInstance } from "class-transformer";
import { TYPES } from "../core/type.core";
import { AuthService } from "../modules/auth/auth.service";
import { User } from "../modules/user/entity/user.entity";
import { JwtUtil } from "../shared/utils/jwt.util";
import { Logger } from "../shared/utils/logger.util";
import { UnauthorizedException } from "../shared/errors/all.exception";

@injectable()
export class ValidateAccessToken extends BaseMiddleware {
  constructor(
    @inject(TYPES.Logger) private readonly _logger: Logger,
    @inject(TYPES.JwtUtil) private readonly _jwtUtil: JwtUtil,
    @inject(TYPES.IAuthService) private readonly _authService: AuthService
  ) {
    super();
  }

  async handler(req: Request, res: Response, next: NextFunction) {
    try {
      this._logger.trace(`[ValidateAccessToken] start`);
      const AUTH_TYPE = "Bearer ";
      const header = req.headers.authorization;

      let accessToken: string;

      // 요청 헤더와 타입이 맞다면 accessToken 할당
      if (header && header.startsWith(AUTH_TYPE)) {
        accessToken = header.split(" ")[1];
      } else {
        this._logger.trace(
          `[ValidateAccessToken] access token not in 'authorization' header or 'Bearer ' type`
        );
        throw new UnauthorizedException("authentication error");
      }

      // access token 유효 여부 판단
      let decoded = this._jwtUtil.verify(accessToken);
      if (decoded.status === "invalid") {
        this._logger.trace(`[ValidateAccessToken] jwt verify error`);
        throw new UnauthorizedException("authentication error");
      }
      if (decoded.status === "expired") {
        this._logger.trace(`[ValidateAccessToken] jwt expired`);
        throw new UnauthorizedException("access token expired");
      }

      // access token의 payload가 유효한 사용자 확인
      const { id, nickname, mbti } = decoded;
      await this._authService.validateUserWithToken(id, nickname, mbti);

      req.user = plainToInstance(User, {
        id: decoded.id,
        nickname: decoded.nickname,
        mbti: decoded.mbti,
        isAdmin: decoded.isAdmin,
      });

      this._logger.trace(`[ValidateAccessToken] call next`);
      return next();
    } catch (err) {
      return next(err);
    }
  }
}
