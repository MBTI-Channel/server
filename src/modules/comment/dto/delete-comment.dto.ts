import { Type } from "class-transformer";
import { IsNotEmpty, IsNumber, Min } from "class-validator";

export class DeleteCommentDto {
  @IsNumber()
  @Min(1)
  @Type(() => Number)
  @IsNotEmpty()
  id: number;
}
