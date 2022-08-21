import { NotificationType } from "../../../shared/type.shared";
import { User } from "../../user/entity/user.entity";
import { GetAllNotificationsDto, NotificationResponseDto } from "../dto";
import {
  PageInfiniteScrollInfoDto,
  PageResponseDto,
} from "../../../shared/page";

export interface INotificationService {
  createByTargetUser(
    targetUser: User,
    userId: number,
    targetId: number,
    type: NotificationType
  ): Promise<void>;
  getAllByUser(
    user: User,
    pageOptionsDto: GetAllNotificationsDto
  ): Promise<
    PageResponseDto<PageInfiniteScrollInfoDto, NotificationResponseDto>
  >;
  readOne(user: User, id: number): Promise<void>;
  readAll(user: User): Promise<number>;
  // countUnread():Promise<number>
}
