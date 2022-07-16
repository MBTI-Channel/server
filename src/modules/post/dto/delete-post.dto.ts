import { Type } from "class-transformer";
import { IsInt, IsNotEmpty, Min } from "class-validator";

export class DeletePostDto {
  @IsInt()
  @Type(() => Number)
  @Min(1)
  @IsNotEmpty()
  id: number;
}
