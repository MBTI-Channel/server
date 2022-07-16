import { Type } from "class-transformer";
import { IsInt, IsNotEmpty, Min } from "class-validator";

export class getDetailPostDto {
  @IsInt()
  @Type(() => Number)
  @Min(1)
  @IsNotEmpty()
  id: number;
}
