import { IsOptional, IsString } from "class-validator";

export class SearchWordDto {
  @IsString()
  @IsOptional()
  searchWord: string;
}
