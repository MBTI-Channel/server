import { IsNotEmpty, IsNumber, IsString } from "class-validator";
import { JwtPayload } from "jsonwebtoken";

export class DecodedDto implements JwtPayload {
  @IsNumber()
  id: number;

  @IsString()
  nickname: string;

  @IsString()
  mbti: string;

  @IsNumber()
  isAdmin: number;

  @IsString()
  @IsNotEmpty()
  iss: string;

  @IsNumber()
  @IsNotEmpty()
  iat: number;

  @IsNumber()
  @IsNotEmpty()
  exp: number;
}
