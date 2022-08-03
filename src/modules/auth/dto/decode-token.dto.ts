import { IsDate, IsNotEmpty, IsNumber, IsString } from "class-validator";
import { JwtPayload } from "jsonwebtoken";

export class DecodedDto implements JwtPayload {
  @IsNumber()
  id: number;

  @IsString()
  nickname: string;

  @IsString()
  mbti: string;

  @IsNumber()
  isAdmin: boolean;

  @IsDate()
  createdAt: Date;

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
  @IsNotEmpty()
  status: "success" | "invalid" | "expired";
}
