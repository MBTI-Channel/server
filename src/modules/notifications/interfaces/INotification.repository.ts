import { Notification } from "../entity/notification.entity";

export interface INotificationRepository {
  create(entity: Notification): Promise<void>;
  //findAllByUserId(userId:number): Promise<any>;
  findOneById(id: number): Promise<Notification>;
  update(id: number, payload: Partial<Notification>): Promise<Notification>;
  //readAll(userId:number): Promise<any>;
  //countUnreadByUserId(userId:number): Promise<number>;
}
