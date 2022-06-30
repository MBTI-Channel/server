import { IsIn, IsNotEmpty, IsString } from "class-validator";
import { PROVIDER_KEY } from "../../../shared/constant.shared";
import { Provider } from "../../../shared/type.shared";

export class LoginDto {
  @IsString()
  @IsNotEmpty()
  @IsIn(PROVIDER_KEY)
  provider: Provider;

  @IsString()
  @IsNotEmpty()
  providerId: string;
}
