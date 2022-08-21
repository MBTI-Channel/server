import { Request, Response } from "express";
import { inject } from "inversify";
import {
  controller,
  httpGet,
  httpPatch,
  queryParam,
  requestParam,
} from "inversify-express-utils";
import { TYPES } from "../../core/types.core";
import { INotificationService } from "./interfaces/INotification.service";
import { User } from "../user/entity/user.entity";
import {
  paramsValidator,
  queryValidator,
} from "../../middlewares/validator.middleware";
import { ReadOneDto, GetAllNotificationsDto } from "./dto";

@controller("/notifications")
export class NotificationController {
  constructor(
    @inject(TYPES.INotificationService)
    private readonly _notificationService: INotificationService
  ) {}

  // 알림 전체 읽음 처리
  @httpPatch("/all/readAt", TYPES.ValidateAccessTokenMiddleware)
  public async readAll(req: Request, res: Response) {
    const user = req.user as User;
    const data = await this._notificationService.readAll(user);
    return res.status(200).json({ readCount: data });
  }

  // 알림 한 개 읽음 처리
  @httpPatch(
    "/:id/readAt",
    TYPES.ValidateAccessTokenMiddleware,
    paramsValidator(ReadOneDto)
  )
  public async readOne(
    @requestParam() param: ReadOneDto,
    req: Request,
    res: Response
  ) {
    const user = req.user as User;
    const { id } = param;
    await this._notificationService.readOne(user, id);
    return res.status(200).json({ isRead: true });
  }

  // 알림 전체 보기
  @httpGet(
    "/",
    TYPES.ValidateAccessTokenMiddleware,
    queryValidator(GetAllNotificationsDto)
  )
  public async getAll(
    @queryParam() query: GetAllNotificationsDto,
    req: Request,
    res: Response
  ) {
    const user = req.user as User;
    const data = await this._notificationService.getAllByUser(user, query);
    return res.status(200).json(data);
  }
}
