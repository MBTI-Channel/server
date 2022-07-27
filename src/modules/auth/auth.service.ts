import { inject, injectable } from "inversify";
import { User } from "../user/entity/user.entity";
import { Logger } from "../../shared/utils/logger.util";
import { IAuthService } from "./interfaces/IAuth.service";
import { ITokenPayload } from "./interfaces/ITokenPayload";
import { TYPES } from "../../core/types.core";
import { SignOptions } from "jsonwebtoken";
import { JwtUtil } from "../../shared/utils/jwt.util";
import { UnauthorizedException } from "../../shared/errors/all.exception";
import { UserRepository } from "../user/user.repository";
import config from "../../config";
import { IRedisService } from "../../core/database/interfaces/IRedis.service";

@injectable()
export class AuthService implements IAuthService {
  constructor(
    @inject(TYPES.Logger) private readonly _logger: Logger,
    @inject(TYPES.JwtUtil) private readonly _jwtUtil: JwtUtil,
    @inject(TYPES.IUserRepository)
    private readonly _userRepository: UserRepository,
    @inject(TYPES.IRedisService) private readonly _redisService: IRedisService
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

  /**
   * payload의 데이터가 이상이 없는지 확인하는 함수
   */
  public async validateUserWithToken(
    id: number,
    nickname: string,
    mbti: string
  ) {
    this._logger.trace(`[validateUserWithToken] start`);

    const user = await this._userRepository.findOneById(id);

    // 존재하지않는 user id
    if (!user) {
      this._logger.warn(`[validateUserWithToken] not exists user id : ${id}`);
      throw new UnauthorizedException("authentication error");
    }

    // status가 normal이 아닌 user
    if (user.status !== config.user.status.normal) {
      this._logger.warn(
        `[validateUserWithToken] not normal status user id : ${id}`
      );
      throw new UnauthorizedException("authentication error");
    }

    // access token payload와 db의 user 정보 불일치
    if (user.mbti !== mbti || user.nickname !== nickname) {
      this._logger.warn(
        `[validateUserWithToken] access token payload and database user info does not match`
      );
      throw new UnauthorizedException("authentication error");
    }

    this._logger.trace(`[validateUserWithToken] clear`);
  }

  public async hasRefreshAuth(key: string, refreshToken: string) {
    this._logger.trace(`[hasRefreshAuth] start`);
    const redisRefreshToken = await this._redisService.get(key);
    // 일치하는 key 없음
    if (!redisRefreshToken) return false;
    // value가 같지 않음
    if (redisRefreshToken !== refreshToken) return false;
    return true;
  }

  public async setTokenInRedis(key: string, refreshToken: string) {
    this._logger.trace(`[setTokenInRedis] start`);
    await this._redisService.set(key, refreshToken);
  }
}
