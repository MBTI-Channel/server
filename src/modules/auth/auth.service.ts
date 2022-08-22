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
    this._log(`generateAccessToken start`);
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
    this._log(`generateRefreshToken start`);
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

  public async validateUserWithToken(
    id: number,
    nickname: string,
    mbti: string
  ) {
    this._log("validateUserWithToken start");

    const user = await this._userRepository.findOneById(id);

    this._log(`check if the user id ${id} exists in the server`);
    if (!user) throw new UnauthorizedException("authentication error");

    this._log(`check if the user status is normal`);
    if (user.status !== config.user.status.normal)
      throw new UnauthorizedException("authentication error");

    this._log(`check if payload matches server's user info`);
    if (user.mbti !== mbti || user.nickname !== nickname)
      throw new UnauthorizedException("authentication error");
  }

  public async hasRefreshAuth(refreshStatusKey: string, refreshToken: string) {
    this._log(`hasRefreshAuth start`);
    const redisRefreshToken = await this._redisService.get(refreshStatusKey);

    if (!redisRefreshToken) {
      this._log(`no matching refreshStatusKey found`);
      return false;
    }
    if (redisRefreshToken !== refreshToken) {
      this._log(`refresh token does not match server refresh token`);
      return false;
    }
    return true;
  }

  private async _setTokenInRedis(
    refreshStatusKey: string,
    refreshToken: string
  ) {
    this._log(`_setTokenInRedis : ${refreshStatusKey} : ${refreshToken}`);
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
