import { IsIn, IsNotEmpty, IsString } from "class-validator";
import { Provider } from "../../user/entity/user.entity";

export const PROVIDER_KEY: string[] = ["kakao", "naver"];

export class OauthLoginDto {
  @IsString()
  @IsNotEmpty()
  @IsIn(PROVIDER_KEY)
  provider: Provider;

  @IsString()
  @IsNotEmpty()
  authCode: string;
}
