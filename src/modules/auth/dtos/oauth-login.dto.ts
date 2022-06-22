import { IsIn, IsNotEmpty, IsString } from "class-validator";
import { Provider, PROVIDER_KEY } from "../../user/entity/user.entity";

export class OauthLoginDto {
  @IsString()
  @IsNotEmpty()
  @IsIn(PROVIDER_KEY)
  provider: Provider;

  @IsString()
  @IsNotEmpty()
  authCode: string;
}
