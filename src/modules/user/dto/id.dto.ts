import { Type } from "class-transformer";
import { IsInt, IsNotEmpty, Min } from "class-validator";

export class IdDto {
  @IsInt()
  @Type(() => Number)
  @Min(1)
  @IsNotEmpty()
  userId: number;
}
