import { Exclude, Expose } from "class-transformer";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";

@Exclude()
export class UserInfoDto {
  @IsNumber()
  @IsNotEmpty()
  @Expose()
  id: number;

  @IsString()
  @IsNotEmpty()
  @Expose()
  nickname: string;

  @IsString()
  @IsNotEmpty()
  @Expose()
  mbti: string;

  @IsNumber()
  @IsNotEmpty()
  @Expose()
  isAdmin: boolean;
}
