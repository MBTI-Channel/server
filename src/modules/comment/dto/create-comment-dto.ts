import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsString,
  Length,
} from "class-validator";

export class CreateCommentDto {
  @IsInt()
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
