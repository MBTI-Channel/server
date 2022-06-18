import { JwtPayload } from "jsonwebtoken";
import { LoginDto } from "../../dtos/user/login.dto";

export interface IAuthService {
  login(loginDto: LoginDto): Promise<any>;
}

export interface ITokenPayload extends JwtPayload {
  id?: number;
  nickname?: string;
  mbti?: string;
  isAdmin?: boolean;
  iss: string;
}
