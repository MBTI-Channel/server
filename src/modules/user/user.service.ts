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
    @inject(TYPES.Logger) private readonly logger: Logger,
    @inject(TYPES.IUserRepository)
    private readonly userRepository: IUserRepository,
    @inject(TYPES.IAuthService)
    private readonly authService: IAuthService,
    @inject(TYPES.JwtUtil) private readonly jwtUtil: JwtUtil
  ) {}

  public async create(dto: CreateUserDto): Promise<User> {
    return await this.userRepository.create(dto);
  }

  public async findOne(payload: Partial<User>): Promise<User> {
    const user = await this.userRepository.findOne(payload);
    if (!user) throw new NotFoundException("not exists user");
    return user;
  }

  public async update(id: number, payload: QueryDeepPartialEntity<User>) {
    const user = await this.findOne({ id });
    if (!user) throw new NotFoundException("not exists user");
    const updatedUser = await this.userRepository.update(id, payload);

    return updatedUser;
  }

  public async login(dto: LoginDto): Promise<any> {
    const user = await this.findOne(dto);
    if (!user) {
      throw new NotFoundException("not exists user");
    }

    const [accessToken, refreshToken] = await Promise.all([
      this.authService.generateAccessToken(user),
      this.authService.generateRefreshToken(),
    ]);

    return { user, accessToken, refreshToken };
  }

  public async signUp(dto: SignUpDto): Promise<any> {
    const { id, nickname, mbti } = dto;
    // 존재하는 유저 id인지, 회원가입 가능한 상태인지 확인
    // 악성 가입 요청을 방지하기 위해 동일한 인증에러, 메세지 반환
    const foundUser = await this.findOne({ id });
    if (!foundUser || foundUser.status !== config.user.status.new)
      throw new UnauthorizedException("not exists user or invalid request");

    // 중복 닉네임이라면 에러
    const foundNickname = await this.isExistsNickname({ nickname });
    if (foundNickname) throw new ConflictException("already exists nickname");

    // 업데이트 및 토큰 발급
    const user = await this.update(id, {
      nickname,
      mbti,
      status: config.user.status.normal,
    });
    const [accessToken, refreshToken] = await Promise.all([
      this.authService.generateAccessToken(user),
      this.authService.generateRefreshToken(),
    ]);

    return { user, accessToken, refreshToken };
  }

  public async isExistsNickname(dto: NicknameDuplicateCheckDto) {
    const { nickname } = dto;
    try {
      await this.findOne({ nickname });
      return true;
    } catch (err) {
      return false;
    }
  }

  public async reissueAccessToken(oldAccessToken: string) {
    const decodedToken = this.jwtUtil.decode(oldAccessToken);
    let userId = decodedToken.id;

    const user = await this.findOne({ id: userId });
    if (!user) throw new Error("user not found");

    const newAccessToken = await this.authService.generateAccessToken(user);
    return { newAccessToken };
  }
}
