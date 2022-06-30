import { inject, injectable } from "inversify";
import { QueryDeepPartialEntity } from "typeorm/query-builder/QueryPartialEntity";
import { User } from "./entity/user.entity";
import { IUserService } from "./interfaces/IUser.service";
import { TYPES } from "../../core/type.core";
import { IUserRepository } from "./interfaces/IUser.repository";
import {
  ConflictException,
  NotFoundException,
  UnauthorizedException,
} from "../../errors/all.exception";
import { IAuthService } from "../auth/interfaces/IAuth.service";
import { Logger } from "../../utils/logger.util";
import { JwtUtil } from "../../utils/jwt.util";
import {
  LoginDto,
  SignUpDto,
  NicknameDuplicateCheckDto,
  CreateUserDto,
} from "./dto";
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

  public async create(dto: CreateUserDto): Promise<User> {
    return await this._userRepository.create(dto);
  }

  public async findOneById(id: number): Promise<User | null> {
    return await this._userRepository.findOneById(id);
  }

  public async findOneByProviderInfo(dto: LoginDto): Promise<User | null> {
    return await this._userRepository.findOneByProviderInfo(dto);
  }

  public async update(id: number, payload: QueryDeepPartialEntity<User>) {
    const user = await this._userRepository.findOneById(id);
    if (!user) throw new NotFoundException("not exists user");
    const updatedUser = await this._userRepository.update(id, payload);

    return updatedUser;
  }

  public async login(dto: LoginDto): Promise<any> {
    const user = await this._userRepository.findOneByProviderInfo(dto);
    if (!user) {
      throw new NotFoundException("not exists user");
    }

    const [accessToken, refreshToken] = await Promise.all([
      this._authService.generateAccessToken(user),
      this._authService.generateRefreshToken(),
    ]);

    return { user, accessToken, refreshToken };
  }

  public async signUp(dto: SignUpDto): Promise<any> {
    const { id, nickname, mbti } = dto;
    // 존재하는 유저 id인지, 회원가입 가능한 상태인지 확인
    // 악성 가입 요청을 방지하기 위해 동일한 인증에러, 메세지 반환
    const foundUser = await this._userRepository.findOneById(id);
    if (!foundUser || foundUser.status !== config.user.status.new)
      throw new UnauthorizedException("not exists user or invalid request");

    // 중복 닉네임이라면 에러
    const foundNickname = await this.isExistsNickname({ nickname });
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

    return { user, accessToken, refreshToken };
  }

  public async isExistsNickname(dto: NicknameDuplicateCheckDto) {
    const { nickname } = dto;
    const foundNickname = await this._userRepository.findOneByNickname(
      nickname
    );
    if (foundNickname) return true;
    return false;
  }

  public async reissueAccessToken(oldAccessToken: string) {
    const decodedToken = this._jwtUtil.decode(oldAccessToken);
    // TODO: 수정필요
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
