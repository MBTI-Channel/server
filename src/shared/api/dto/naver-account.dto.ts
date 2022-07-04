import { Expose, Transform } from "class-transformer";
import { FEMALE, MALE, NOT_ACCEPT } from "../../constant.shared";
import { IAccountDto } from "../interfaces/IAccount.dto";

export class NaverAccountDto implements IAccountDto {
  public id: string;

  @Expose({ name: "age" })
  @Transform(
    ({ value }) => {
      if (value) return value;
      return NOT_ACCEPT;
    },
    { toClassOnly: true }
  )
  public ageRange?: string;

  @Transform(
    ({ value }) => {
      if (value === "M") return MALE;
      if (value === "F") return FEMALE;
      return NOT_ACCEPT;
    },
    { toClassOnly: true }
  )
  public gender?: number;
}
