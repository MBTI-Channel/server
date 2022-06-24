import { IsIn, IsNotEmpty, IsString } from "class-validator";
import { Provider, PROVIDER_KEY } from "../entity/user.entity";

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @IsIn(PROVIDER_KEY)
  provider: Provider;

  @IsString()
  @IsNotEmpty()
  providerId: string;

  @IsString()
  providerData: string;
}
