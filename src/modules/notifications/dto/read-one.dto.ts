import { Type } from "class-transformer";
import { IsInt, IsNotEmpty, Min } from "class-validator";

export class ReadOneDto {
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  id: number;
}
