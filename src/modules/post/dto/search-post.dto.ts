import { Type } from "class-transformer";
import { IsEnum, IsInt, IsOptional, Max, Min } from "class-validator";
import { CategoryName, PostOrder } from "../../../shared/enum.shared";

export class SearchPostDto {
  @IsEnum(CategoryName)
  @IsOptional()
  category: CategoryName;

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

  get skip(): number {
    return this.startId;
  }
}
