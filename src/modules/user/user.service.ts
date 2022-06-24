import { inject, injectable } from "inversify";
import { User } from "./entity/user.entity";
import { IUserService } from "./interfaces/IUser.service";
import { TYPES } from "../../core/type.core";
import { IUserRepository } from "./interfaces/IUser.repository";
import { CreateUserDto } from "./dtos/create-user.dto";
import { NotFoundException } from "../../errors/all.exception";
import { NicknameDuplicateCheckDto } from "./dtos/nickname-duplicate-check.dto";
import { LoginDto } from "./dtos/login.dto";
import { IAuthService } from "../auth/interfaces/IAuth.service";
import { Logger } from "../../utils/logger.util";
import { JwtUtil } from "../../utils/jwt.util";

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

  public async isExistsNickname(dto: NicknameDuplicateCheckDto) {
    const { nickname } = dto;
    try {
      await this.findOne({ nickname });
      return true;
    } catch (err) {
      return false;
    }
  }

  public async login(dto: LoginDto): Promise<any> {
    const user = await this.findOne(dto);
    if (!user) {
      this.logger.error("not exists user");
      throw new NotFoundException("not exists user");
    }

    const [accessToken, refreshToken] = await Promise.all([
      this.authService.generateAccessToken(user),
      this.authService.generateRefreshToken(),
    ]);

    return { user, accessToken, refreshToken };
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
