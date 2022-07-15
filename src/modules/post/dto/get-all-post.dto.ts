import { Type } from "class-transformer";
import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  Max,
  Min,
} from "class-validator";
import { CategoryName, PostOrder } from "../../../shared/enum.shared";

export class GetAllPostDto {
  @IsEnum(CategoryName)
  @IsNotEmpty()
  category: CategoryName;

  @IsInt()
  @Min(0)
  @Type(() => Number)
  @IsOptional()
  startId: number = 0;

  @IsInt()
  @Min(10)
  @Max(50)
  @Type(() => Number)
  @IsOptional()
  maxResults: number = 30;

  @IsEnum(PostOrder)
  @IsOptional()
  order: PostOrder = PostOrder.CREATED_AT;

  get skip(): number {
    return this.startId;
  }
}
