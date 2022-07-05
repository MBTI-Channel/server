import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsString,
  Length,
} from "class-validator";

export class CreatePostDto {
  @IsNumber()
  @IsNotEmpty()
  categoryId: number;

  @IsBoolean()
  isSecret: boolean;

  @IsString()
  @IsNotEmpty()
  @Length(1, 10)
  title: string;

  @IsString()
  @IsNotEmpty()
  content: string;
}
