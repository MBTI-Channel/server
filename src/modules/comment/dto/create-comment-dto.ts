import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsString,
  Length,
} from "class-validator";

export class CreateCommentDto {
  @IsNumber()
  @IsNotEmpty()
  postId: number;

  @IsString()
  @IsNotEmpty()
  @Length(1, 1000)
  content: string;

  @IsBoolean()
  @IsNotEmpty()
  isSecret: boolean;
}
