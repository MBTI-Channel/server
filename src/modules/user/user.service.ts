import { inject, injectable } from "inversify";
import { TYPES } from "../../core/type.core";
import { IUserService } from "./interfaces/IUser.service";
import { IAuthService } from "../auth/interfaces/IAuth.service";
import { IUserRepository } from "./interfaces/IUser.repository";
import { User } from "./entity/user.entity";
import {
  UserTokenResponseDto,
  UserResponseDto,
  NeedSignUpResponseDto,
} from "./dto";
import { Logger } from "../../shared/utils/logger.util";
import { JwtUtil } from "../../shared/utils/jwt.util";
import {
  BadReqeustException,
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

  public async create(
    provider: Provider,
    providerId: string,
    gender: number,
    ageRange: string
  ) {
    this._logger.trace(`[UserService] create start`);
    const userEntitiy = User.of(provider, providerId, gender, ageRange);
    const user = await this._userRepository.create(userEntitiy);
    return new NeedSignUpResponseDto(user);
  }

  public async findOneById(id: number) {
    this._logger.trace(`[UserService] findOneById start`);
    const user = await this._userRepository.findOneById(id);
    if (!user) return null;
    return new UserResponseDto(user);
  }

  // 로그인
  public async login(
    id: number,
    providerId: string
  ): Promise<UserTokenResponseDto> {
    this._logger.trace(`[UserService] login start`);

    const user = await this._userRepository.findOneById(id);

    // err: 존재하지 않는 user id
    this._logger.trace(`[UserService] check is exists user id`);
    if (!user) {
      throw new NotFoundException("not exists user");
    }

    // err: user providerId와 요청 providerId 다름
    this._logger.trace(
      `[UserService] check user providerId and providerId match`
    );
    if (user.providerId !== providerId)
      throw new UnauthorizedException("user does not match");

    const [accessToken, refreshToken] = await Promise.all([
      this._authService.generateAccessToken(user),
      this._authService.generateRefreshToken(),
    ]);

    return new UserTokenResponseDto(user, accessToken, refreshToken);
  }

  // 닉네임, mbti를 update하여 회원가입 처리한다.
  public async signUp(
    id: number,
    uuid: string,
    nickname: string,
    mbti: string
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
    const foundNickname = await this.isExistsNickname(nickname);
    if (foundNickname) throw new ConflictException("already exists nickname");

    // suc: 업데이트 및 토큰 발급
    const updatedUser = await this._userRepository.update(user.id, {
      nickname,
      mbti,
      status: config.user.status.normal,
    });
    const [accessToken, refreshToken] = await Promise.all([
      this._authService.generateAccessToken(updatedUser),
      this._authService.generateRefreshToken(),
    ]);

    return new UserTokenResponseDto(updatedUser, accessToken, refreshToken);
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

  // 중복 닉네임이 있는지 확인한다.
  public async isExistsNickname(nickname: string) {
    const foundNickname = await this._userRepository.findOneByNickname(
      nickname
    );
    return foundNickname !== null;
  }

  // user가 유효한지 확인한다.
  async isValid(id: number) {
    this._logger.trace(`[UserService] is valid user id? : ${id}`);
    const user = await this._userRepository.findOneStatus(id);
    if (!user) return false;
    if (!user.isActive()) return false;
    return true;
  }
}
