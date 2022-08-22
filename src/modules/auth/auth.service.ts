import { inject, injectable } from "inversify";
import { User } from "../user/entity/user.entity";
import { Logger } from "../../shared/utils/logger.util";
import { IAuthService } from "./interfaces/IAuth.service";
import { ITokenPayload } from "./interfaces/ITokenPayload";
import { IRedisService } from "../../core/database/interfaces/IRedis.service";
import { IUserRepository } from "../user/interfaces/IUser.repository";
import { TYPES } from "../../core/types.core";
import { SignOptions } from "jsonwebtoken";
import { JwtUtil } from "../../shared/utils/jwt.util";
import { UnauthorizedException } from "../../shared/errors/all.exception";
import config from "../../config";

@injectable()
export class AuthService implements IAuthService {
  constructor(
    @inject(TYPES.Logger) private readonly _logger: Logger,
    @inject(TYPES.JwtUtil) private readonly _jwtUtil: JwtUtil,
    @inject(TYPES.IUserRepository)
    private readonly _userRepository: IUserRepository,
    @inject(TYPES.IRedisService) private readonly _redisService: IRedisService
  ) {}

  private _log(message: string) {
    this._logger.trace(`[AuthService] ${message}`);
  }

  public async generateAccessToken(user: User) {
    const { id, nickname, mbti, isAdmin, createdAt } = user;
    const payload: ITokenPayload = {
      id,
      nickname,
      mbti,
      isAdmin,
      createdAt,
    };
    const options: SignOptions = {
      expiresIn: config.jwt.accessTokenExpiresIn,
      issuer: config.jwt.issuer,
    };
    const accessToken = this._jwtUtil.sign(payload, options);
    return accessToken;
  }

  public async generateRefreshToken(refreshStatusKey: string) {
    const payload: ITokenPayload = {};
    const options: SignOptions = {
      expiresIn: config.jwt.refreshTokenExpiresIn,
      issuer: config.jwt.issuer,
    };
    const refreshToken = this._jwtUtil.sign(payload, options);

    // redis에 refresh token 저장
    await this._setTokenInRedis(refreshStatusKey, refreshToken);
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
    this._log("validateUserWithToken start");

    const user = await this._userRepository.findOneById(id);

    // 존재하지않는 user id
    if (!user) {
      this._logger.warn(`[AuthService] not exists user id : ${id}`);
      throw new UnauthorizedException("authentication error");
    }

    // status가 normal이 아닌 user
    if (user.status !== config.user.status.normal) {
      this._logger.warn(`[AuthService] not normal status user id : ${id}`);
      throw new UnauthorizedException("authentication error");
    }

    // access token payload와 db의 user 정보 불일치
    if (user.mbti !== mbti || user.nickname !== nickname) {
      this._logger.warn(
        `[AuthService] access token payload and database user info does not match`
      );
      throw new UnauthorizedException("authentication error");
    }
  }

  public async hasRefreshAuth(refreshStatusKey: string, refreshToken: string) {
    this._log(`hasRefreshAuth start`);
    const redisRefreshToken = await this._redisService.get(refreshStatusKey);
    // 일치하는 key 없음
    if (!redisRefreshToken) return false;
    // value가 같지 않음
    if (redisRefreshToken !== refreshToken) return false;
    return true;
  }

  private async _setTokenInRedis(
    refreshStatusKey: string,
    refreshToken: string
  ) {
    this._log(`setTokenInRedis start`);

    await this._redisService.set(refreshStatusKey, refreshToken);
  }

  public getRefreshStatusKey(userId: number, userAgent: string): string {
    return `${userId}-${userAgent}`;
  }

  public async removeRefreshStatus(refreshStatusKey: string) {
    this._log(`removeRefreshStatus start`);
    await this._redisService.del(refreshStatusKey);
  }
}
