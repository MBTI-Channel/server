import { IsBoolean, IsOptional, IsString, Length } from "class-validator";

export class UpdatePostDto {
  @IsString()
  @IsOptional()
  @Length(1, 30)
  title: string;

  @IsString()
  @IsOptional()
  content: string;

  @IsBoolean()
  @IsOptional()
  isSecret: boolean;
}
