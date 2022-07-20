import { Type } from "class-transformer";
import { IsInt, IsNotEmpty, IsOptional, Max, Min } from "class-validator";

export class GetAllRepliesDto {
  @IsInt()
  @Min(1)
  @IsNotEmpty()
  @Type(() => Number)
  parentId: number;

  @IsInt()
  @Min(1)
  @IsOptional()
  @Type(() => Number)
  startId: number = 1;

  @IsInt()
  @Min(10)
  @Max(50)
  @IsOptional()
  @Type(() => Number)
  maxResults: number = 10;
}
