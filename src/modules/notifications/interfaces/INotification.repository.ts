import { GetAllNotificationsDto } from "../dto";
import { Notification } from "../entity/notification.entity";

export interface INotificationRepository {
  create(entity: Notification): Promise<void>;
  findAllByUserId(
    userId: number,
    pageOptionsDto: GetAllNotificationsDto
  ): Promise<[Notification[], number]>;
  findOneById(id: number): Promise<Notification>;
  update(id: number, payload: Partial<Notification>): Promise<Notification>;
  //readAll(userId:number): Promise<any>;
  //countUnreadByUserId(userId:number): Promise<number>;
}
