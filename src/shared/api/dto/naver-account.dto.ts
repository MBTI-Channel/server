import { Expose } from "class-transformer";
import { FEMALE, MALE, NOT_ACCEPT } from "../../constant.shared";
import { IAccountDto } from "../interfaces/IAccount.dto";

export class NaverAccountDto implements IAccountDto {
  public id: string;

  @Expose({ name: "age" })
  public ageRange?: string;

  public gender?: string;

  public getGender() {
    if (this.gender === "M") return MALE;
    if (this.gender === "F") return FEMALE;
    return NOT_ACCEPT;
  }

  public getAgeRange() {
    if (this.ageRange) return this.ageRange;
    return NOT_ACCEPT;
  }
}
