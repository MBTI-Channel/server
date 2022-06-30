import { IsIn, IsNotEmpty, IsNumber, IsString } from "class-validator";
import { JwtPayload } from "jsonwebtoken";
import { DECODED_STATUS_KEY } from "../../../shared/constant.shared";

export class DecodedDto implements JwtPayload {
  @IsNumber()
  id: number;

  @IsString()
  nickname: string;

  @IsString()
  mbti: string;

  @IsNumber()
  isAdmin: boolean;

  @IsString()
  @IsNotEmpty()
  iss: string;

  @IsNumber()
  @IsNotEmpty()
  iat: number;

  @IsNumber()
  @IsNotEmpty()
  exp: number;

  @IsString()
  @IsIn(DECODED_STATUS_KEY)
  @IsNotEmpty()
  status: string;
}
