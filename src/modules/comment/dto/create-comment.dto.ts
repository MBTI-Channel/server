import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsString,
  Length,
  Min,
} from "class-validator";

export class CreateCommentDto {
  @IsInt()
  @Min(1)
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
