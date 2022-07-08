import { Expose, Type } from "class-transformer";
import { IsIn, IsNotEmpty, IsNumber, IsOptional, Min } from "class-validator";
import { COMMENT_ORDER_KEY } from "../../../shared/constant.shared";

export class GetAllCommentDto {
  @IsNumber()
  @Min(1)
  @Type(() => Number)
  @IsNotEmpty()
  postId: number;

  @IsNumber()
  @Min(1)
  @Type(() => Number)
  @IsOptional()
  page?: number;

  @IsNumber()
  @Min(1)
  @Type(() => Number)
  @IsOptional()
  maxResults?: number;

  @IsIn(COMMENT_ORDER_KEY)
  @IsOptional()
  order?: string;
}
