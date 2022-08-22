import { inject, injectable } from "inversify";
import { TYPES } from "../../core/types.core";
import { IUserService } from "./interfaces/IUser.service";
import { IAuthService } from "../auth/interfaces/IAuth.service";
import { IUserRepository } from "./interfaces/IUser.repository";
import { User } from "./entity/user.entity";
import {
  UserTokenResponseDto,
  UserResponseDto,
  NeedSignUpResponseDto,
  AccessTokenResponseDto,
} from "./dto";
import { Logger } from "../../shared/utils/logger.util";
import { JwtUtil } from "../../shared/utils/jwt.util";
import { IApiWebhookService } from "../../shared/api/interfaces/IApi-webhook.service";
import { IPostRepository } from "../post/interfaces/IPost.repository";
import {
  BadReqeustException,
  ConflictException,
  NotFoundException,
  UnauthorizedException,
} from "../../shared/errors/all.exception";
import { Provider } from "../../shared/type.shared";
import config from "../../config";
import { Mbti } from "../../shared/enum.shared";
import { IUpdateLogService } from "./update-log/interfaces/IUpdate-log.service";

@injectable()
export class UserService implements IUserService {
  constructor(
    @inject(TYPES.Logger) private readonly _logger: Logger,
    @inject(TYPES.IUserRepository)
    private readonly _userRepository: IUserRepository,
    @inject(TYPES.IAuthService)
    private readonly _authService: IAuthService,
    @inject(TYPES.JwtUtil) private readonly _jwtUtil: JwtUtil,
    @inject(TYPES.IApiWebhookService)
    private readonly _apiWebhookService: IApiWebhookService,
    @inject(TYPES.IPostRepository)
    private readonly _postRepository: IPostRepository,
    @inject(TYPES.IUpdateLogService)
    private readonly _updateLogService: IUpdateLogService
  ) {}

  private _log(message: string) {
    this._logger.trace(`[UserService] ${message}`);
  }

  public async create(
    provider: Provider,
    providerId: string,
    gender: number,
    ageRange: string
  ) {
    this._log(`create start`);
    const userEntitiy = User.of(provider, providerId, gender, ageRange);
    const user = await this._userRepository.create(userEntitiy);
    this._log(`create successful`);
    return new NeedSignUpResponseDto(user);
  }

  public async updateNickname(user: User, nickname: string) {
    this._log(`updateNickname start`);

    await this.checkDuplicateNickname(nickname);

    // 닉네임 업데이트 후 업데이트된 accessToken 리턴
    const updatedUser = await this._userRepository.update(user.id, {
      nickname,
    });
    const accessToken = await this._authService.generateAccessToken(
      updatedUser
    );
    return new AccessTokenResponseDto(accessToken);
  }

  public async updateMbti(user: User, mbti: Mbti) {
    this._log("updateMbti start");

    this._log("check if the mbti to be updated === the current mbti");
    if (user.mbti === mbti) throw new ConflictException("same mbti as now");

    this._log("check if mbti update is possible"); // mbti 업데이트 기록이 2주 이내라면 수정할 수 없다
    const updateLog = await this._updateLogService.findLastOneByType(
      user.id,
      "mbti"
    );
    if (updateLog && !this._isMbtiUpdateAvailable(updateLog.createdAt))
      throw new BadReqeustException(
        `mbti update available date has not passed. last updated at :${updateLog.createdAt.toISOString()}`
      );

    const updatedUser = await this._userRepository.update(user.id, {
      mbti,
    });
    await this._updateLogService.create(user, "mbti", user.mbti, mbti);

    const accessToken = await this._authService.generateAccessToken(
      updatedUser
    );

    this._log("mbti update successful");
    return new AccessTokenResponseDto(accessToken);
  }

  /**
   * mbti 업데이트 기록이 2주 이내라면 false, 아니라면 true 리턴
   */
  private _isMbtiUpdateAvailable(updateLogCreatedAt: Date) {
    const msNow = new Date().getTime();
    const msCreatedAt = updateLogCreatedAt.getTime();
    const msDifferenceFromNow = msNow - msCreatedAt;
    const twoWeeks = 1000 * 60 * 60 * 24 * 14;

    return twoWeeks < msDifferenceFromNow ? true : false;
  }

  public async login(
    id: number,
    providerId: string,
    userAgent: string
  ): Promise<UserTokenResponseDto> {
    this._log(`login start`);

    const user = await this._userRepository.findOneById(id);

    this._log(`check if user id ${id} exists`);
    if (!user) {
      throw new NotFoundException("not exists user");
    }

    this._log(`check user providerId and providerId match`);
    if (user.providerId !== providerId)
      throw new UnauthorizedException("user does not match");

    const refreshKey = this._authService.getRefreshStatusKey(user.id, userAgent);
    const [accessToken, refreshToken] = await Promise.all([
      this._authService.generateAccessToken(user),
      this._authService.generateRefreshToken(refreshKey),
    ]);

    this._log(`user login successful`);
    return new UserTokenResponseDto(user, accessToken, refreshToken);
  }

  public async logout(id: number, refreshToken: string, userAgent: string) {
    this._log(`logout start`);

    this._log(`check refresh status`);
    const refreshKey = this._authService.getRefreshStatusKey(id, userAgent);
    const hasAuth = await this._authService.hasRefreshAuth(
      refreshKey,
      refreshToken
    );
    if (!hasAuth) {
      //TODO: 디스코드 알림
      this._logger.warn(
        `[UserService] warning! suspected token theft user: ${id}`
      );
      throw new UnauthorizedException("authentication error");
    }
    await this._authService.removeRefreshStatus(refreshKey);
    this._log(`user logout successful`);
  }

  public async signUp(
    id: number,
    uuid: string,
    nickname: string,
    mbti: string,
    userAgent: string
  ) {
    this._log(`check if user id ${id} exists`);
    const user = await this._userRepository.findOneById(id);
    if (!user) throw new NotFoundException("not exists user");

    this._log(`check if the uuid matches the uuid of the server`);
    if (user.uuid !== uuid)
      throw new UnauthorizedException("user does not match");

    this._log(`check if user id ${id} is already signed up`);
    if (user.status !== config.user.status.new)
      throw new BadReqeustException("already sign up user");

    await this.checkDuplicateNickname(nickname);

    const updatedUser = await this._userRepository.update(user.id, {
      nickname,
      mbti,
      status: config.user.status.normal,
    });
    const refreshKey = this._authService.getRefreshStatusKey(user.id, userAgent);
    const [accessToken, refreshToken] = await Promise.all([
      this._authService.generateAccessToken(updatedUser),
      this._authService.generateRefreshToken(refreshKey),
    ]);

    this._log(`user sign up successful`);
    return new UserTokenResponseDto(updatedUser, accessToken, refreshToken);
  }

  public async leave(
    id: number,
    refreshToken: string,
    userAgent: string
  ): Promise<void> {
    this._log(`leave start`);

    this._log(`check refresh status`);
    const refreshKey = this._authService.getRefreshStatusKey(id, userAgent);
    const hasAuth = await this._authService.hasRefreshAuth(
      refreshKey,
      refreshToken
    );
    if (!hasAuth) {
      //TODO: 디스코드 알림
      this._logger.warn(
        `[UserService] warning! suspected token theft user: ${id}`
      );
      throw new UnauthorizedException("authentication error");
    }
    await this._authService.removeRefreshStatus(refreshKey);

    await this._userRepository.update(id, {
      status: config.user.status.withdrawal,
    });

    this._log(`user leave successful`);
  }

  public async reissueAccessToken(
    user: User,
    refreshToken: string,
    userAgent: string
  ) {
    this._log(`reissueAccessToken start`);
    // redis의 정보와 일치하는지 확인
    const refreshKey = this._authService.getRefreshStatusKey(user.id, userAgent);
    const hasAuth = await this._authService.hasRefreshAuth(
      refreshKey,
      refreshToken
    );
    if (!hasAuth) {
      //TODO: 디스코드 알림
      this._logger.warn(
        `[UserService] warning! suspected token theft user: ${user.id}`
      );
      throw new UnauthorizedException("authentication error");
    }

    const accessToken = await this._authService.generateAccessToken(user);
    return new AccessTokenResponseDto(accessToken);
  }

  public async checkDuplicateNickname(nickname: string) {
    this._log(`checkDuplicateNickname start`);

    const foundNickname = await this._userRepository.findOneByNickname(
      nickname
    );
    if (foundNickname) throw new ConflictException("already exists nickname");

    this._log(`${nickname} is a available nickname`);
  }

  public async isValid(id: number) {
    this._log(`check if user id ${id} is valid`);
    const user = await this._userRepository.findOneStatus(id);
    if (!user) return false;
    if (!user.isActive()) return false;
    return true;
  }
}
