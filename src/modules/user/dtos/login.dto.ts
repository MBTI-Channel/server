import { IsIn, IsNotEmpty, IsString } from "class-validator";
import { Provider, PROVIDER_KEY } from "../entity/user.entity";

export class LoginDto {
  @IsString()
  @IsNotEmpty()
  @IsIn(PROVIDER_KEY)
  provider: Provider;

  @IsString()
  @IsNotEmpty()
  providerId: string;
}
