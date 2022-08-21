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

  // targetUser에 의해 userId에게 알림을 생성한다.
  public async createByTargetUser(
    targetUser: User,
    userId: number,
    targetId: number,
    type: NotificationType
  ): Promise<void> {
    this._log(`createByTargetUser start`);
    //return: 알림대상 user === 알림원인 user
    if (userId === targetUser.id) {
      this._log(`createByTargetUser fail - same target user & user`);
      return;
    }

    const isValidUser = await this._userService.isValid(userId);
    //return: 없는 || 탈퇴 || 가입처리 안한 user
    if (!isValidUser) {
      this._log(`createByTargetUser fail - isValidUser`);
      return;
    }

    const notification = Notification.of(targetUser, userId, targetId, type);
    this._log(`create notification`);
    await this._notificationRepository.create(notification);
  }

  // user의 알림 리스트를 조회한다.
  public async findAll(user: User, pageOptionsDto: GetAllNotificationsDto) {
    this._log(`findAll start`);

    const [notificationArray, totalCount] =
      await this._notificationRepository.findAllByUserId(
        user.id,
        pageOptionsDto
      );

    // notificationArray 길이가 maxResults보다 작다면 nextId는 null, 아니라면 마지막 idx의 id 할당
    let nextId: number | null;
    if (notificationArray.length < pageOptionsDto.maxResults) nextId = null;
    else nextId = notificationArray[notificationArray.length - 1].id;

    // 응답 DTO로 변환후 리턴
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
    this._log(`exsits notification ? ${id}`);
    const notification = await this._notificationRepository.findOneById(id);

    if (!notification) throw new NotFoundException("not exists notification");
    this._log(`check authorization`);
    if (notification.userId !== user.id)
      throw new ForbiddenException("authorization error");

    // 이미 읽은 알림
    this._log(`check already read`);
    if (notification.readAt)
      throw new BadReqeustException("already read notification");

    await this._notificationRepository.update(id, { readAt: new Date() });
  }

  // readAt 업데이트 후 읽은 알림 수를 리턴한다.
  public async readAll(user: User) {
    this._log(`readAll start`);
    return await this._notificationRepository.updateAllUnread(user.id);
  }
}
