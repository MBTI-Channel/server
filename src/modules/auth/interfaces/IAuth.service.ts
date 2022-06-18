import { JwtPayload } from "jsonwebtoken";
import { User } from "../../user/entity/user.entity";
import { LoginDto } from "../dtos/login.dto";

export interface IAuthService {
  login(loginDto: LoginDto): Promise<any>;
  generateAccessToken(user: User): Promise<string>;
  generateRefreshToken(): Promise<string>;
}

export interface ITokenPayload extends JwtPayload {
  id?: number;
  nickname?: string;
  mbti?: string;
  isAdmin?: boolean;
  iss: string;
}
