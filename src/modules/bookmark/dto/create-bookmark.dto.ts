import { IsInt, IsNotEmpty } from "class-validator";

export class CreateBookmarkDto {
  @IsInt()
  @IsNotEmpty()
  targetId: number;
}
