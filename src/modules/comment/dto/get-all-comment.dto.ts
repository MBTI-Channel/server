import { Type } from "class-transformer";
import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  Max,
  Min,
} from "class-validator";
import { CommentOrder } from "../../../shared/enum.shared";

export class GetAllCommentDto {
  @IsInt()
  @Min(1)
  @Type(() => Number)
  @IsNotEmpty()
  postId: number;

  @IsEnum(CommentOrder)
  @IsOptional()
  order: CommentOrder = CommentOrder.CREATED_AT;

  @IsInt()
  @Min(1)
  @Type(() => Number)
  @IsOptional()
  page: number = 1;

  @IsInt()
  @Min(10)
  @Max(50)
  @Type(() => Number)
  @IsOptional()
  maxResults: number = 30;
}
