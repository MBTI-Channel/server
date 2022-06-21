import { inject, injectable } from "inversify";
import { User } from "../user/entity/user.entity";
import { NotFoundException } from "../../errors/all.exception";
import { Logger } from "../../utils/logger.util";
import { IAuthService } from "./interfaces/IAuth.service";
import { ITokenPayload } from "./interfaces/ITokenPayload";
import { TYPES } from "../../core/type.core";
import { SignOptions } from "jsonwebtoken";
import { JwtUtil } from "../../utils/jwt.util";
import { LoginDto } from "./dtos/login.dto";
import { IUserService } from "../user/interfaces/IUser.service";
import config from "../../config";
import { DecodedDto } from "./dtos/decode-token.dto";

@injectable()
export class AuthService implements IAuthService {
  constructor(
    @inject(TYPES.Logger) private readonly logger: Logger,
    @inject(TYPES.JwtUtil) private readonly jwtUtil: JwtUtil,
    @inject(TYPES.IUserService)
    private readonly userService: IUserService
  ) {}

  public async login(dto: LoginDto): Promise<any> {
    const user = await this.userService.findOne(dto);
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
      iss: config.jwt.issuer,
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
      iss: config.jwt.issuer,
    };
    const options: SignOptions = {
      expiresIn: config.jwt.refreshTokenExpiresIn,
    };
    const refreshToken = this.jwtUtil.sign(payload, options);
    return refreshToken;
  }

  public async reissueAccessToken(
    oldAccessToken: string,
    refreshToken: string // TODO: Dto로 수정
  ) {
    let refreshTokenValid = true;
    const isValidate = await this.jwtUtil.verify(refreshToken);

    if (!isValidate) {
      refreshTokenValid = false;
      return { refreshTokenValid };
    }

    const decodedToken = this.jwtUtil.decode(oldAccessToken);
    let userId = decodedToken.id;

    const user = await this.userService.findOne({ id: userId });
    if (!user) throw new Error("user not found");

    const newAccessToken = await this.generateAccessToken(user);
    return { refreshTokenValid, newAccessToken };
  }
}
