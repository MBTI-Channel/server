import { inject, injectable } from "inversify";
import { User } from "../../entities/user.entity";
import { NotFoundException } from "../../errors/all.exception";
import { Logger } from "../../utils/logger.util";
import { IAuthService, ITokenPayload } from "../interfaces/IAuth.service";
import { TYPES } from "../type.core";
import { SignOptions } from "jsonwebtoken";
import config from "../../config";
import { JwtUtils } from "../../utils/jwt.util";
import { LoginDto } from "../../dtos/user/login.dto";
import { IUserService } from "../interfaces/IUser.service";

const ISSUER = "MBTI Channel";

@injectable()
export class AuthService implements IAuthService {
  constructor(
    @inject(TYPES.Logger) private readonly logger: Logger,
    @inject(TYPES.JwtUtils) private readonly jwtUtils: JwtUtils,
    @inject(TYPES.IUserService)
    private readonly userService: IUserService
  ) {}

  public async login(loginDto: LoginDto): Promise<any> {
    const user = await this.userService.findOne(loginDto);
    if (!user) {
      this.logger.error("not exists user");
      throw new NotFoundException("not exists user");
    }
    const [accessToken, refreshToken] = await Promise.all([
      this.generateAccessToken(user),
      this.generateRefreshToken(),
    ]);

    return { user, accessToken, refreshToken };
  }

  private async generateAccessToken(user: User) {
    const { id, nickname, mbti, isAdmin } = user;
    const payload: ITokenPayload = {
      id,
      nickname,
      mbti,
      isAdmin,
      iss: ISSUER,
    };
    const options: SignOptions = {
      expiresIn: config.jwt.accessTokenExpiresIn,
    };
    const accessToken = this.jwtUtils.sign(payload, options);
    return accessToken;
  }

  private async generateRefreshToken() {
    // TODO: redis
    const payload: ITokenPayload = {
      iss: ISSUER,
    };
    const options: SignOptions = {
      expiresIn: config.jwt.refreshTokenExpiresIn,
    };
    const refreshToken = this.jwtUtils.sign(payload, options);
    return refreshToken;
  }
}
