import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class DecodedDto {
  @IsNumber()
  @IsNotEmpty()
  id: number;

  @IsString()
  @IsNotEmpty()
  nickname: string;

  @IsString()
  @IsNotEmpty()
  mbti: string;

  @IsNumber()
  @IsNotEmpty()
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
