import { inject, injectable } from "inversify";
import { plainToInstance } from "class-transformer";
import { TYPES } from "../../core/type.core";
import { IUserService } from "./interfaces/IUser.service";
import { IAuthService } from "../auth/interfaces/IAuth.service";
import { IUserRepository } from "./interfaces/IUser.repository";
import { User } from "./entity/user.entity";
import { UserTokenResponseDto, UserResponseDto, TokenResponseDto } from "./dto";
import { Logger } from "../../shared/utils/logger.util";
import { JwtUtil } from "../../shared/utils/jwt.util";
import {
  ConflictException,
  NotFoundException,
  UnauthorizedException,
} from "../../shared/errors/all.exception";
import { Provider } from "../../shared/type.shared";
import config from "../../config";

@injectable()
export class UserService implements IUserService {
  constructor(
    @inject(TYPES.Logger) private readonly _logger: Logger,
    @inject(TYPES.IUserRepository)
    private readonly _userRepository: IUserRepository,
    @inject(TYPES.IAuthService)
    private readonly _authService: IAuthService,
    @inject(TYPES.JwtUtil) private readonly _jwtUtil: JwtUtil
  ) {}

  private _toUserResponseDto(user: User) {
    return plainToInstance(UserResponseDto, {
      id: user.id,
      mbti: user.mbti,
      nickname: user.nickname,
      isAdmin: user.isAdmin,
      isActive: user.status !== config.user.status.withdrawal ? true : false,
    });
  }

  private _toUserTokenResponseDto(
    user: User,
    accessToken: string,
    refreshToken: string
  ) {
    return plainToInstance(UserTokenResponseDto, {
      id: user.id,
      mbti: user.mbti,
      nickname: user.nickname,
      isAdmin: user.isAdmin,
      isActive: user.status !== config.user.status.withdrawal ? true : false,
      accessToken,
      refreshToken,
    });
  }

  private _toTokenResponseDto(accessToken: string, refreshToken: string) {
    return plainToInstance(TokenResponseDto, {
      accessToken,
      refreshToken,
    });
  }

  public async create(
    provider: Provider,
    providerId: string,
    gender?: number,
    ageRange?: string
  ) {
    this._logger.trace(`[UserService] create start`);
    //TODO: 생성전 중복 회원 검증 로직
    const userEntity = await this._userRepository.createEntity(
      provider,
      providerId,
      gender,
      ageRange
    );
    const user = await this._userRepository.create(userEntity);
    return this._toUserResponseDto(user);
  }

  public async findOneById(id: number) {
    this._logger.trace(`[UserService] findOneById start`);
    const user = await this._userRepository.findOneById(id);
    if (!user) return null;
    return this._toUserResponseDto(user);
  }

  public async findOneByProviderInfo(provider: Provider, providerId: string) {
    this._logger.trace(`[UserService] findOneByProviderInfo start`);
    const user = await this._userRepository.findOneByProviderInfo(
      provider,
      providerId
    );
    if (!user) return null;
    return this._toUserResponseDto(user);
  }

  public async update(id: number, payload: Partial<User>) {
    const user = await this._userRepository.findOneById(id);
    if (!user) throw new NotFoundException("not exists user");
    const updatedUser = await this._userRepository.update(id, payload);
    return this._toUserResponseDto(updatedUser);
  }

  public async login(
    provider: Provider,
    providerId: string
  ): Promise<UserTokenResponseDto> {
    const user = await this._userRepository.findOneByProviderInfo(
      provider,
      providerId
    );
    if (!user) {
      throw new NotFoundException("not exists user");
    }

    const [accessToken, refreshToken] = await Promise.all([
      this._authService.generateAccessToken(user),
      this._authService.generateRefreshToken(),
    ]);

    return this._toUserTokenResponseDto(user, accessToken, refreshToken);
  }

  public async signUp(id: number, nickname: string, mbti: string) {
    // 존재하는 유저 id인지, 회원가입 가능한 상태인지 확인
    // 악성 가입 요청을 방지하기 위해 동일한 인증에러, 메세지 반환
    const foundUser = await this._userRepository.findOneById(id);
    if (!foundUser || foundUser.status !== config.user.status.new)
      throw new UnauthorizedException("not exists user or invalid request");

    // 중복 닉네임이라면 에러
    const foundNickname = await this.isExistsNickname(nickname);
    if (foundNickname) throw new ConflictException("already exists nickname");

    // 업데이트 및 토큰 발급
    const user = await this._userRepository.update(id, {
      nickname,
      mbti,
      status: config.user.status.normal,
    });
    const [accessToken, refreshToken] = await Promise.all([
      this._authService.generateAccessToken(user),
      this._authService.generateRefreshToken(),
    ]);

    return this._toUserTokenResponseDto(user, accessToken, refreshToken);
  }

  public async isExistsNickname(nickname: string) {
    const foundNickname = await this._userRepository.findOneByNickname(
      nickname
    );
    if (foundNickname) return true;
    return false;
  }

  public async reissueAccessToken(oldAccessToken: string) {
    // TODO: 수정필요
    const decodedToken = this._jwtUtil.decode(oldAccessToken);
    return {
      accessToken: "1",
      refreshToken: "1",
    };
    // return this._toTokenResponseDto(accessToken, refreshToken)

    // if (decodedToken.status !== "success") {
    //   throw new UnauthorizedException("token is not validate");
    // }

    // let userId = decodedToken.id;

    // const user = await this._userRepository.findOneById(userId);
    // if (!user) {
    //   throw new NotFoundException("not exists user");
    // }

    // const newAccessToken = await this._authService.generateAccessToken(user);
    // return { newAccessToken };
  }
}
