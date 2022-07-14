import {
  IsIn,
  IsInt,
  IsNotEmpty,
  IsString,
  IsUUID,
  Length,
  Matches,
} from "class-validator";
import { MBTI_KEY } from "../../../shared/constant.shared";

export class SignUpDto {
  @IsInt()
  @IsNotEmpty()
  id: number;

  @IsUUID()
  @IsNotEmpty()
  uuid: string;

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
