import { Type } from "class-transformer";
import { IsInt, IsOptional, Max, Min } from "class-validator";

// 무한스크롤로 수정 될 수 있음
export class GetMyPostsDto {
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
