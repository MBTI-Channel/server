import { FEMALE, MALE, NOT_ACCEPT } from "../../constant.shared";
import { IAccountDto } from "../interfaces/IAccount.dto";

export class KaKaoAccountDto implements IAccountDto {
  public id: string;

  public ageRange?: string;

  public gender?: string;

  getGender() {
    if (this.gender === "male") return MALE;
    if (this.gender === "female") return FEMALE;
    return NOT_ACCEPT;
  }

  getAgeRange() {
    if (this.ageRange) return this.ageRange;
    return NOT_ACCEPT;
  }
}
