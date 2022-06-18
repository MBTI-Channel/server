import { inject, injectable } from "inversify";
import { User } from "../user/entity/user.entity";
import { NotFoundException } from "../../errors/all.exception";
import { Logger } from "../../utils/logger.util";
import { IAuthService } from "./interfaces/IAuth.service";
import { ITokenPayload } from "./interfaces/ITokenPayload";
import { TYPES } from "../../core/type.core";
import { SignOptions } from "jsonwebtoken";
import config from "../../config";
import { JwtUtil } from "../../utils/jwt.util";
import { LoginDto } from "./dtos/login.dto";
import { IUserService } from "../user/interfaces/IUser.service";

const ISSUER = "MBTI Channel";

@injectable()
export class AuthService implements IAuthService {
  constructor(
    @inject(TYPES.Logger) private readonly logger: Logger,
    @inject(TYPES.JwtUtil) private readonly jwtUtil: JwtUtil,
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

  public async generateAccessToken(user: User) {
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
    const accessToken = this.jwtUtil.sign(payload, options);
    return accessToken;
  }

  public async generateRefreshToken() {
    // TODO: redis
    const payload: ITokenPayload = {
      iss: ISSUER,
    };
    const options: SignOptions = {
      expiresIn: config.jwt.refreshTokenExpiresIn,
    };
    const refreshToken = this.jwtUtil.sign(payload, options);
    return refreshToken;
  }
}
