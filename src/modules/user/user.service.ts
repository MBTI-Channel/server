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
  GetMyPostsDto,
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
import { PageInfoDto, PageResponseDto } from "../../shared/page";
import config from "../../config";
import { PostResponseDto } from "../post/dto";

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
    private readonly _postRepository: IPostRepository
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
    return new NeedSignUpResponseDto(user);
  }

  public async findOneById(id: number) {
    this._log(`findOneById start`);
    const user = await this._userRepository.findOneById(id);
    if (!user) return null;
    return new UserResponseDto(user);
  }

  // 내가 작성한 게시글 조회
  public async getMyPosts(user: User, pageOptionsDto: GetMyPostsDto) {
    const { id } = user;
    const [myPostArray, totalCount] =
      await this._postRepository.findAllByUserId(pageOptionsDto, id);

    // 페이지 정보
    const pageInfoDto = new PageInfoDto(
      totalCount,
      myPostArray.length,
      pageOptionsDto.page
    );

    return new PageResponseDto(
      pageInfoDto,
      myPostArray.map((e) => new PostResponseDto(e, user))
    );
  }

  // 로그인
  public async login(
    id: number,
    providerId: string,
    userAgent: string
  ): Promise<UserTokenResponseDto> {
    this._log(`login start`);

    const user = await this._userRepository.findOneById(id);

    // err: 존재하지 않는 user id
    this._log(`check is exists user id`);
    if (!user) {
      throw new NotFoundException("not exists user");
    }

    // err: user providerId와 요청 providerId 다름
    this._log(`check user providerId and providerId match`);
    if (user.providerId !== providerId)
      throw new UnauthorizedException("user does not match");

    const key = `${user.id}-${userAgent}`;
    const [accessToken, refreshToken] = await Promise.all([
      this._authService.generateAccessToken(user),
      this._authService.generateRefreshToken(key),
    ]);

    return new UserTokenResponseDto(user, accessToken, refreshToken);
  }

  // 닉네임, mbti를 update하여 회원가입 처리한다.
  public async signUp(
    id: number,
    uuid: string,
    nickname: string,
    mbti: string,
    userAgent: string
  ) {
    const user = await this._userRepository.findOneById(id);
    // err: 존재하지 않는 user id
    if (!user) throw new NotFoundException("not exists user");

    // err: user uuid와 요청 uuid 다름
    if (user.uuid !== uuid)
      throw new UnauthorizedException("user does not match");

    // err: 이미 가입한 상태
    if (user.status !== config.user.status.new)
      throw new BadReqeustException("already sign up user");

    // err: 중복 닉네임
    await this.checkDuplicateNickname(nickname);

    // suc: 업데이트 및 토큰 발급
    const updatedUser = await this._userRepository.update(user.id, {
      nickname,
      mbti,
      status: config.user.status.normal,
    });
    const key = `${user.id}-${userAgent}`;
    const [accessToken, refreshToken] = await Promise.all([
      this._authService.generateAccessToken(updatedUser),
      this._authService.generateRefreshToken(key),
    ]);

    return new UserTokenResponseDto(updatedUser, accessToken, refreshToken);
  }

  public async reissueAccessToken(
    user: User,
    refreshToken: string,
    userAgent: string
  ) {
    this._log(`reissueAccessToken start`);
    // redis의 정보와 일치하는지 확인
    const key = `${user.id}-${userAgent}`;
    const hasAuth = await this._authService.hasRefreshAuth(key, refreshToken);
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

  // 중복 닉네임이 있는지 확인한다.
  public async checkDuplicateNickname(nickname: string) {
    const foundNickname = await this._userRepository.findOneByNickname(
      nickname
    );
    if (foundNickname) throw new ConflictException("already exists nickname");
  }

  // user가 유효한지 확인한다.
  public async isValid(id: number) {
    this._log(`is valid user id? : ${id}`);
    const user = await this._userRepository.findOneStatus(id);
    if (!user) return false;
    if (!user.isActive()) return false;
    return true;
  }
}
