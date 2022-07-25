import { IsEnum, IsInt, IsNotEmpty } from "class-validator";
import { LikeTargetType } from "../../../shared/enum.shared";

export class CreateLikeDto {
  @IsEnum(LikeTargetType)
  @IsNotEmpty()
  type: string;

  @IsInt()
  @IsNotEmpty()
  targetId: number;
}
