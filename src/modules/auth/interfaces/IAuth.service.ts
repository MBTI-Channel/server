import { User } from "../../user/entity/user.entity";
import { DecodedDto } from "../dtos/decode-token.dto";

export interface IAuthService {
  generateAccessToken(user: User): Promise<string>;
  generateRefreshToken(): Promise<string>;
  validateUserWithToken(dto: DecodedDto): Promise<void>;
}
