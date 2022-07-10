import { inject, injectable } from "inversify";
import { TYPES } from "../../core/type.core";
import { INotificationService } from "./interfaces/INotification.service";
import { IUserService } from "../user/interfaces/IUser.service";
import { INotificationRepository } from "./interfaces/INotification.repository";
import { Notification } from "./entity/notification.entity";
import { User } from "../user/entity/user.entity";
import { Logger } from "../../shared/utils/logger.util";
import { NotificationType } from "../../shared/type.shared";

@injectable()
export class NotificationService implements INotificationService {
  constructor(
    @inject(TYPES.Logger) private readonly _logger: Logger,
    @inject(TYPES.IUserService)
    private readonly _userService: IUserService,
    @inject(TYPES.INotificationRepository)
    private readonly _notificationRepository: INotificationRepository
  ) {}

  // targetUser에 의해 userId에게 알림을 생성한다.
  async createByTargetUser(
    targetUser: User,
    userId: number,
    targetId: number,
    type: NotificationType
  ): Promise<void> {
    this._logger.trace(`[NotificationService] createByTargetUser start`);
    //return: 알림대상 user === 알림원인 user
    if (userId === targetUser.id) {
      this._logger.trace(
        `[NotificationService] createByTargetUser fail - same target user & user`
      );
      return;
    }

    const isValidUser = await this._userService.isValid(userId);
    //return: 없는 || 탈퇴 || 가입처리 안한 user
    if (!isValidUser) {
      this._logger.trace(
        `[NotificationService] createByTargetUser fail - isValidUser`
      );
      return;
    }

    const notification = Notification.of(targetUser, userId, targetId, type);

    this._logger.trace(`[NotificationService] create notification`);
    await this._notificationRepository.create(notification);
  }
}
