import { NotificationType } from "../../../shared/type.shared";
import { User } from "../../user/entity/user.entity";

export interface INotificationService {
  createByTargetUser(
    targetUser: User,
    userId: number,
    targetId: number,
    type: NotificationType
  ): Promise<void>;
  // findAll(id:number):Promise<any>
  readOne(user: User, id: number): Promise<void>;
  // readAll()():Promise<void>
  // countUnread():Promise<number>
}
