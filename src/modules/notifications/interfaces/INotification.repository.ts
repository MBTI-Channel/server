import { Notification } from "../entity/notification.entity";

export interface INotificationRepository {
  create(entity: Notification): Promise<void>;
  //findAllByUserId(userId:number): Promise<any>;
  //readOne(userId:number): Promise<any>;
  //readAll(userId:number): Promise<any>;
  //countUnreadByUserId(userId:number): Promise<number>;
}