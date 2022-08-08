import { Type } from "class-transformer";
import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  Min,
} from "class-validator";
import { ReportTargetType } from "../../../shared/enum.shared";

export class ReportDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsNotEmpty()
  targetId: number;

  @IsEnum(ReportTargetType)
  @IsNotEmpty()
  targetType: ReportTargetType;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsNotEmpty()
  targetUserId: number;

  @Length(1, 200)
  @IsString()
  @IsOptional()
  reason: string;
}
