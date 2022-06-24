import {
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsString,
  Length,
  Matches,
} from "class-validator";
import { MBTI_KEY } from "../entity/user.entity";

export class SignUpDto {
  @IsNumber()
  @IsNotEmpty()
  id: number;

  @IsString()
  @Length(2, 10)
  @Matches(/^[|가-힣|a-z|A-Z|0-9|]{2,10}$/)
  @IsNotEmpty()
  nickname: string;

  @IsString()
  @IsIn(MBTI_KEY)
  @IsNotEmpty()
  mbti: string;
}
