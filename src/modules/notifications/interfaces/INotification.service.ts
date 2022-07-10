import { NotificationType } from "../../../shared/type.shared";
import { User } from "../../user/entity/user.entity";

export interface INotificationService {
  createByTargetUser(
    targetUser: User,
    userId: number,
    targetId: number,
    type: NotificationType
  ): Promise<void>;
  // findAllByUserId(id:number):Promise<any>
  // readOne:Promise<void>
  // readAll()():Promise<void>
  // countUnread():Promise<number>
}
