import { IsIn, IsNotEmpty, IsString } from "class-validator";
import { Provider } from "../entity/user.entity";

export const PROVIDER_KEY: string[] = ["kakao", "naver"]; // TODO: 리팩토링

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
