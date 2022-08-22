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

  private _log(message: string) {
    this._logger.trace(`[NotificationService] ${message}`);
  }

  public async createByTargetUser(
    targetUser: User,
    userId: number,
    targetId: number,
    type: NotificationType
  ): Promise<void> {
    this._log(`createByTargetUser start`);

    this._log(`check if user and target user are the same user`);
    if (userId === targetUser.id) {
      this._log(`createByTargetUser fail - target user === user`);
      return;
    }

    this._log(`check if target user is valid`);
    const isValidUser = await this._userService.isValid(userId);
    if (!isValidUser) {
      this._log(`createByTargetUser fail - isValidUser`);
      return;
    }

    this._log(`create notification successful`);
    const notification = Notification.of(targetUser, userId, targetId, type);
    await this._notificationRepository.create(notification);
  }

  public async getAllByUser(
    user: User,
    pageOptionsDto: GetAllNotificationsDto
  ) {
    this._log(`findAll start`);

    const notificationArray = //TODO: pageOptionsDto에 따라 count 달라지므로 수정필요
      await this._notificationRepository.findAllByUserId(
        user.id,
        pageOptionsDto
      );

    // notificationArray 길이가 maxResults보다 작다면 nextId는 null, 아니라면 마지막 idx의 id 할당
    let nextId: number | null;
    if (notificationArray.length < pageOptionsDto.maxResults) nextId = null;
    else nextId = notificationArray[notificationArray.length - 1].id;

    const pageInfoDto = new PageInfiniteScrollInfoDto(
      notificationArray.length,
      nextId
    );

    return new PageResponseDto(
      pageInfoDto,
      notificationArray.map((e) => new NotificationResponseDto(e))
    );
  }

  public async readOne(user: User, id: number): Promise<void> {
    this._log(`readOne start`);

    this._log(`check if notification id ${id} exists`);
    const notification = await this._notificationRepository.findOneById(id);
    if (!notification) throw new NotFoundException("not exists notification");

    this._log(`check if user has authorization for notification id ${id}`);
    if (notification.userId !== user.id)
      throw new ForbiddenException("authorization error");

    this._log(`check if a notification has already been read`);
    if (notification.readAt)
      throw new BadReqeustException("already read notification");

    await this._notificationRepository.update(id, { readAt: new Date() });
  }

  public async readAll(user: User) {
    this._log(`readAll start`);
    return await this._notificationRepository.updateAllUnread(user.id);
  }
}
