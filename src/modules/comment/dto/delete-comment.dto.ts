import { Type } from "class-transformer";
import { IsInt, IsNotEmpty, Min } from "class-validator";

export class DeleteCommentDto {
  @IsInt()
  @Min(1)
  @Type(() => Number)
  @IsNotEmpty()
  id: number;
}
