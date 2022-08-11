import { IsNotEmpty, IsString, Length, Matches } from "class-validator";

export class UpdateUserNicknameDto {
  @IsString()
  @Length(2, 10)
  @Matches(/^[|가-힣|a-z|A-Z|0-9|]{2,10}$/)
  @IsNotEmpty()
  nickname: string;
}
