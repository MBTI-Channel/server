import { IsEnum, IsNotEmpty, IsString, Length, Matches } from "class-validator";
import { Mbti } from "../../../shared/enum.shared";

export class UpdateUserDto {
  @IsString()
  @Length(2, 10)
  @Matches(/^[|가-힣|a-z|A-Z|0-9|]{2,10}$/)
  @IsNotEmpty()
  nickname: string;

  @IsString()
  @IsEnum(Mbti)
  @IsNotEmpty()
  mbti: Mbti;
}
