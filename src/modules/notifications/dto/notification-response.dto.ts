import { NotificationType } from "../../../shared/type.shared";
import { Notification } from "../entity/notification.entity";

export class NotificationResponseDto {
  id: number;
  targetUserId: number;
  targetId: number;
  type?: string;
  title: string;
  url: string;
  createdAt: Date;
  readAt: Date | null;

  constructor(entity: Notification) {
    this.id = entity.id;
    this.targetUserId = entity.targetUserId;
    this.targetId = entity.targetId;
    this.type = entity.type as NotificationType;
    this.title = entity.title;
    this.url = entity.url;
    this.createdAt = entity.createdAt;
    this.readAt = entity.readAt ?? null;
  }
}
