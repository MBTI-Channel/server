import { Type } from "class-transformer";
import { IsNotEmpty, IsNumber, Min } from "class-validator";

export class DeletePostDto {
  @IsNumber()
  @Min(1)
  @Type(() => Number)
  @IsNotEmpty()
  id: number;
}
