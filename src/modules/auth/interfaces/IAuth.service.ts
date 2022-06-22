import { User } from "../../user/entity/user.entity";

export interface IAuthService {
  generateAccessToken(user: User): Promise<string>;
  generateRefreshToken(): Promise<string>;
  reissueAccessToken(accessToken: string, refreshToken: string): Promise<any>;
}
