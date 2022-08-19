import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
} from "class-validator";
import { CategoryName } from "../../../shared/enum.shared";

export class CreatePostDto {
  @IsEnum(CategoryName)
  @IsNotEmpty()
  category: CategoryName;

  @IsBoolean()
  @IsOptional()
  isSecret: boolean;

  @IsString()
  @IsNotEmpty()
  @Length(1, 30)
  title: string;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsArray()
  @IsOptional()
  imagesUrl: string[];
}
