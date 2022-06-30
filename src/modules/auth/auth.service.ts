import { inject, injectable } from "inversify";
import { User } from "../user/entity/user.entity";
import { Logger } from "../../utils/logger.util";
import { IAuthService } from "./interfaces/IAuth.service";
import { ITokenPayload } from "./interfaces/ITokenPayload";
import { TYPES } from "../../core/type.core";
import { SignOptions } from "jsonwebtoken";
import { JwtUtil } from "../../utils/jwt.util";
import config from "../../config";

@injectable()
export class AuthService implements IAuthService {
  constructor(
    @inject(TYPES.Logger) private readonly _logger: Logger,
    @inject(TYPES.JwtUtil) private readonly _jwtUtil: JwtUtil
  ) {}

  public async generateAccessToken(user: User) {
    const { id, nickname, mbti, isAdmin } = user;
    const payload: ITokenPayload = {
      id,
      nickname,
      mbti,
      isAdmin,
    };
    const options: SignOptions = {
      expiresIn: config.jwt.accessTokenExpiresIn,
      issuer: config.jwt.issuer,
    };
    const accessToken = this._jwtUtil.sign(payload, options);
    return accessToken;
  }

  public async generateRefreshToken() {
    // TODO: redis
    const payload: ITokenPayload = {};
    const options: SignOptions = {
      expiresIn: config.jwt.refreshTokenExpiresIn,
      issuer: config.jwt.issuer,
    };
    const refreshToken = this._jwtUtil.sign(payload, options);
    return refreshToken;
  }
}
