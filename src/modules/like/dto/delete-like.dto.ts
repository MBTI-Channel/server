import { Type } from "class-transformer";
import { IsEnum, IsInt, IsNotEmpty, Min } from "class-validator";
import { LikeTargetType } from "../../../shared/enum.shared";

export class DeleteLikeDto {
  @IsEnum(LikeTargetType)
  @IsNotEmpty()
  type: string;

  @IsInt()
  @Min(1)
  @Type(() => Number)
  @IsNotEmpty()
  targetId: number;
}
