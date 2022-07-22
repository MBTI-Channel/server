import { Transform, Type } from "class-transformer";
import { IsBoolean, IsInt, IsOptional, Max, Min } from "class-validator";

export class GetAllNotificationsDto {
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
  maxResults: number = 30;

  // string 'false' 'true' 일치 확인후 boolean 변환
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => {
    if (value === "true") return true;
    if (value === "false") return false;
    return value;
  })
  read: boolean = false;
}
