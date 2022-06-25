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

  userMbti?: string;

  userNickname?: string;

  @IsString()
  @IsNotEmpty()
  @Length(1, 10)
  title: string;

  @IsString()
  @IsNotEmpty()
  content: string;
}
