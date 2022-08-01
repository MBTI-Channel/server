import { User } from "../entity/user.entity";
import { UserResponseDto } from "./user-response.dto";

export class UserTokenResponseDto extends UserResponseDto {
  constructor(
    user: User,
    public accessToken: string,
    public refreshToken: string
  ) {
    super(user);
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
  }
}
