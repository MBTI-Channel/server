import { IsIn, IsNotEmpty, IsString } from "class-validator";
import { Provider } from "../../user/entity/user.entity";

export const PROVIDER_KEY: string[] = ["kakao", "naver"]; // TODO: 리팩토링

export class OauthLoginDto {
  @IsString()
  @IsNotEmpty()
  @IsIn(PROVIDER_KEY)
  provider: Provider;

  @IsString()
  @IsNotEmpty()
  authCode: string;
}
