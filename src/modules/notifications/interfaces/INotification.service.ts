import { NotificationType } from "../../../shared/type.shared";
import { User } from "../../user/entity/user.entity";
import { GetAllNotificationsDto, NotificationResponseDto } from "../dto";
import {
  PageInfiniteScrollInfoDto,
  PageResponseDto,
} from "../../../shared/page";

export interface INotificationService {
  /**
   * targetUser에 의해 user에게 알림을 생성합니다.
   * @param targetUser 알림을 준 user
   * @param userId     알림 대상 user id
   * @param targetId   알림 대상 id
   * @param type       알림 종류
   */
  createByTargetUser(
    targetUser: User,
    userId: number,
    targetId: number,
    type: NotificationType
  ): Promise<void>;
  /**
   * user의 알림을 모두 조회합니다.
   */
  getAllByUser(
    user: User,
    pageOptionsDto: GetAllNotificationsDto
  ): Promise<
    PageResponseDto<PageInfiniteScrollInfoDto, NotificationResponseDto>
  >;
  /**
   * user의 알림 하나를 읽음 처리합니다.
   */
  readOne(user: User, id: number): Promise<void>;
  /**
   * user의 알림 전체를 읽음 처리 후, 읽음 처리한 알림 수를 리턴합니다.
   */
  readAll(user: User): Promise<number>;
  // countUnread():Promise<number>
}
