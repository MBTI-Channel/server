import { inject, injectable } from "inversify";
import { Provider, User } from "../../entities/user.entity";
import { NotFoundException } from "../../errors/all.exception";
import { Logger } from "../../utils/logger.util";
import { IAuthService, ITokenPayload } from "../interfaces/IAuth.service";
import { TYPES } from "../type.core";
import { DatabaseService } from "./database.service";
import { SignOptions } from "jsonwebtoken";
import config from "../../config";
import { JwtUtils } from "../../utils/jwt.util";

const ISSUER = "MBTI Channel";

@injectable()
export class AuthService implements IAuthService {
  constructor(
    @inject(TYPES.Logger) private readonly logger: Logger,
    @inject(TYPES.JwtUtils) private readonly jwtUtils: JwtUtils,
    @inject(TYPES.IDatabaseService)
    private readonly databaseService: DatabaseService
  ) {}

  public async login(provider: Provider, providerId: string) {
    const UserRepository = await this.databaseService.getRepository(User);
    const user = await UserRepository.findOne({
      where: {
        provider,
        providerId,
      },
    });
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
