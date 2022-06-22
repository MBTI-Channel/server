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

@injectable()
export class UserService implements IUserService {
  constructor(
    @inject(TYPES.Logger) private readonly logger: Logger,
    @inject(TYPES.IUserRepository)
    private readonly userRepository: IUserRepository,
    @inject(TYPES.IAuthService)
    private readonly authService: IAuthService
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
}
