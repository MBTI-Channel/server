import { Request, Response } from "express";
import { inject } from "inversify";
import {
  controller,
  httpGet,
  httpPatch,
  requestParam,
} from "inversify-express-utils";
import { TYPES } from "../../core/type.core";
import { INotificationService } from "./interfaces/INotification.service";
import { User } from "../user/entity/user.entity";
import { paramsValidator } from "../../middlewares/validator.middleware";
import { ReadOneDto } from "./dto/read-one.dto";

@controller("/notifications")
export class NotificationController {
  constructor(
    @inject(TYPES.INotificationService)
    private readonly _notificationService: INotificationService
  ) {}

  // 알림 한 개 읽음 처리
  @httpPatch(
    "/:id",
    TYPES.ValidateAccessTokenMiddleware,
    paramsValidator(ReadOneDto)
  )
  async readOne(
    @requestParam() param: ReadOneDto,
    req: Request,
    res: Response
  ) {
    const user = req.user as User;
    const { id } = param;
    await this._notificationService.readOne(user, id);
    return res.status(200).json({ isRead: true });
  }

  // 알림 전체 읽음 처리
  @httpPatch("/", TYPES.ValidateAccessTokenMiddleware)
  async readAll(req: Request, res: Response) {
    const user = req.user as User;
    return res.status(200).json();
  }

  // 알림 전체 보기
  @httpGet("/", TYPES.ValidateAccessTokenMiddleware)
  async getAll(req: Request, res: Response) {
    const user = req.user as User;
    return res.status(200).json();
  }
}
