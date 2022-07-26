import { inject, injectable } from "inversify";
import { TYPES } from "../../core/types.core";
import { INotificationService } from "./interfaces/INotification.service";
import { IUserService } from "../user/interfaces/IUser.service";
import { INotificationRepository } from "./interfaces/INotification.repository";
import { Notification } from "./entity/notification.entity";
import { User } from "../user/entity/user.entity";
import { Logger } from "../../shared/utils/logger.util";
import { NotificationType } from "../../shared/type.shared";
import {
  BadReqeustException,
  ForbiddenException,
  NotFoundException,
} from "../../shared/errors/all.exception";
import { GetAllNotificationsDto, NotificationResponseDto } from "./dto";
import { PageInfiniteScrollInfoDto, PageResponseDto } from "../../shared/page";

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

  // user의 알림 리스트를 조회한다.
  async findAll(user: User, pageOptionsDto: GetAllNotificationsDto) {
    this._logger.trace(`[NotificationService] findAll start`);

    const [notificationArray, totalCount] =
      await this._notificationRepository.findAllByUserId(
        user.id,
        pageOptionsDto
      );

    // 다음 알림 페이지 있는지 확인
    let nextId = null;
    if (notificationArray.length === pageOptionsDto.maxResults + 1) {
      nextId = notificationArray[notificationArray.length - 1].id;
      notificationArray.pop();
    }

    // 응답 DTO로 변환후 리턴
    const pageInfoDto = new PageInfiniteScrollInfoDto(
      totalCount,
      notificationArray.length,
      nextId
    );

    return new PageResponseDto(
      pageInfoDto,
      notificationArray.map((e) => new NotificationResponseDto(e))
    );
  }

  async readOne(user: User, id: number): Promise<void> {
    this._logger.trace(`[NotificationService] readOne start`);

    this._logger.trace(`[NotificationService] exsits notification ? ${id}`);
    const notification = await this._notificationRepository.findOneById(id);

    if (!notification) throw new NotFoundException("not exists notification");

    this._logger.trace(`[NotificationService] check authorization`);
    if (notification.userId !== user.id)
      throw new ForbiddenException("authorization error");

    // 이미 읽은 알림
    this._logger.trace(`[NotificationService] check already read`);
    if (notification.readAt)
      throw new BadReqeustException("already read notification");

    await this._notificationRepository.update(id, { readAt: new Date() });
  }

  // readAt 업데이트 후 읽은 알림 수를 리턴한다.
  async readAll(user: User) {
    this._logger.trace(`[NotificationService] readAll start`);
    return await this._notificationRepository.updateAllUnread(user.id);
  }
}
