import { Type } from "class-transformer";
import { IsInt, IsOptional, Max, Min } from "class-validator";

/**
 * 일반 페이지네이션 요청 DTO
 */
export class PageOptionsDto {
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
  maxResults: number = 10;

  get skip(): number {
    return (this.page - 1) * this.maxResults;
  }
}
