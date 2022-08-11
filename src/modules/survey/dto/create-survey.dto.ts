import { Type } from "class-transformer";
import { IsBoolean, IsInt, IsNotEmpty, Min } from "class-validator";

export class CreateSurveyDto {
  @IsInt()
  @Type(() => Number)
  @Min(1)
  @IsNotEmpty()
  id: number;

  @IsBoolean()
  @IsNotEmpty()
  isAgree: boolean;
}
