import { IsIn, IsNotEmpty, IsNumber, IsString } from "class-validator";
import { Column } from "typeorm";
import { BaseEntity } from "../../../shared/base.entity.";
import { PROVIDER_KEY } from "../../../shared/constant.shared";
import { Provider } from "../../../shared/type.shared";

export class UserBase extends BaseEntity {
  @IsString()
  @IsNotEmpty()
  @IsIn(PROVIDER_KEY)
  @Column({
    length: "255",
    comment: "kakao | naver",
  })
  provider: Provider;

  @IsString()
  @IsNotEmpty()
  @Column({
    length: "255",
    comment: "소셜 계정 고유 아이디",
  })
  providerId: string;

  @IsNumber()
  @Column({ default: 0, type: "tinyint", comment: "0: null 1: male 2: female" })
  gender: number;

  @IsString()
  @Column({ default: 0, length: 10, comment: "0: null" })
  ageRange: string;
}
