import { IsIn, IsNotEmpty, IsString } from "class-validator";
import { Provider } from "../entity/user.entity";
import { PROVIDER_KEY } from "../../auth/dtos/oauth-login.dto";

export class LoginDto {
  @IsString()
  @IsNotEmpty()
  @IsIn(PROVIDER_KEY)
  provider: Provider;

  @IsString()
  @IsNotEmpty()
  providerId: string;
}
