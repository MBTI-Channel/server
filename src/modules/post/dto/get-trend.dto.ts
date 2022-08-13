import { Type } from "class-transformer";
import { IsEnum, IsInt, IsOptional, Max, Min } from "class-validator";
import { PostOrder } from "../../../shared/enum.shared";

export class GetTrendDto {
  @IsInt()
  @Type(() => Number)
  @Min(0)
  @IsOptional()
  startId: number = 0;

  @IsInt()
  @Type(() => Number)
  @Min(10)
  @Max(50)
  @IsOptional()
  maxResults: number = 30;

  @IsEnum(PostOrder)
  @IsOptional()
  order: PostOrder = PostOrder.CREATED_AT;
}
