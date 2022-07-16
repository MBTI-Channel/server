import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
} from "class-validator";

export class CreatePostDto {
  @IsInt()
  @IsNotEmpty()
  categoryId: number;

  @IsBoolean()
  @IsOptional()
  isSecret: boolean;

  @IsString()
  @IsNotEmpty()
  @Length(1, 10)
  title: string;

  @IsString()
  @IsNotEmpty()
  content: string;
}
