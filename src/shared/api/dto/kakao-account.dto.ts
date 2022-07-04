import { Transform } from "class-transformer";
import { FEMALE, MALE, NOT_ACCEPT } from "../../constant.shared";
import { IAccountDto } from "../interfaces/IAccount.dto";

export class KaKaoAccountDto implements IAccountDto {
  public id: string;

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
      if (value === "male") return MALE;
      if (value === "female") return FEMALE;
      return NOT_ACCEPT;
    },
    { toClassOnly: true }
  )
  public gender?: number;
}
