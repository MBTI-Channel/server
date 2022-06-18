import { IsIn, IsNotEmpty, IsString } from "class-validator";
import { Provider } from "../../user/entity/user.entity";
import { PROVIDER_KEY } from "./oauth-login.dto";

export class LoginDto {
  @IsString()
  @IsNotEmpty()
  @IsIn(PROVIDER_KEY)
  provider: Provider;

  @IsString()
  @IsNotEmpty()
  providerId: string;
}
