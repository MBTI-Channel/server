import { User } from "../../user/entity/user.entity";
import { LoginDto } from "../dtos/login.dto";

export interface IAuthService {
  login(dto: LoginDto): Promise<any>;
  generateAccessToken(user: User): Promise<string>;
  generateRefreshToken(): Promise<string>;
}
