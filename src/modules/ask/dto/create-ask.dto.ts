import { IsNotEmpty, IsOptional, IsString, Length } from "class-validator";

export class CreateAskDto {
  @IsString()
  @IsNotEmpty()
  @Length(1, 100)
  title: string;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsString()
  @IsOptional()
  imageUrl: string;

  @IsString()
  @IsOptional()
  email: string;
}
