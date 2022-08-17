import { IsEnum, IsNotEmpty, IsString, Length, Matches } from "class-validator";
import { Mbti } from "../../../shared/enum.shared";

export class UpdateUserMbtiDto {
  @IsString()
  @IsEnum(Mbti)
  @IsNotEmpty()
  mbti: Mbti;
}
