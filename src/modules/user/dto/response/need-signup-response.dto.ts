import { User } from "../../entity/user.entity";

export class NeedSignUpResponseDto {
  id: number;
  uuid: string;
  constructor(user: User) {
    this.id = user.id;
    this.uuid = user.uuid;
  }
}
