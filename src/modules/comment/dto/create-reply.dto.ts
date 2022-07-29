import { IsInt, IsNotEmpty, IsOptional, Min } from "class-validator";
import { CreateCommentDto } from "./create-comment.dto";

export class CreateReplyDto extends CreateCommentDto {
  @IsInt()
  @Min(1)
  @IsNotEmpty()
  parentId: number;

  @IsInt()
  @Min(1)
  @IsOptional()
  taggedId?: number;
}
