import { inject, injectable } from "inversify";
import { TYPES } from "../../core/types.core";
import { IReportRepository } from "./interfaces/IReport.repository";
import { IReportService } from "./interfaces/IReport.service";
import { Report } from "./entity/report.entity";
import { ICommentService } from "../comment/interfaces/IComment.service";
import { IPostService } from "../post/interfaces/IPost.service";
import { IUserService } from "../user/interfaces/IUser.service";
import { User } from "../user/entity/user.entity";
import { Logger } from "../../shared/utils/logger.util";
import {
  BadReqeustException,
  NotFoundException,
} from "../../shared/errors/all.exception";
import { IApiWebhookService } from "../../shared/api/interfaces/IApi-webhook.service";
import { ReportTargetType } from "../../shared/enum.shared";

@injectable()
export class ReportService implements IReportService {
  constructor(
    @inject(TYPES.Logger) private readonly _logger: Logger,
    @inject(TYPES.IReportRepository)
    private readonly _reportRepository: IReportRepository,
    @inject(TYPES.IPostService)
    private readonly _postService: IPostService,
    @inject(TYPES.ICommentService)
    private readonly _commentService: ICommentService,
    @inject(TYPES.IUserService)
    private readonly _userService: IUserService,
    @inject(TYPES.IApiWebhookService)
    private readonly _apiWebhookService: IApiWebhookService
  ) {}

  private _log(message: string) {
    this._logger.trace(`[ReportService] ${message}`);
  }

  // targetId에 대한 신고를 생성한다.
  public async createReport(
    user: User,
    targetId: number,
    targetType: ReportTargetType,
    targetUserId: number,
    reason: string
  ) {
    this._log("createReport start");

    // 본인한테 신고요청이라면 에러
    // targetUserId는 유저가 작성후 탈퇴로 회피할 수 있으므로 검증하지 않는다.
    if (user.id === targetUserId)
      throw new BadReqeustException(
        "invalid report. unable to report yourself"
      );

    // 신고 대상이 존재하는지 확인한다
    await this._checkValidTarget(targetType, targetId);

    const reportEntity = Report.of(
      user.id,
      targetId,
      targetType,
      targetUserId,
      reason
    );

    const report = await this._reportRepository.createReport(reportEntity);
    await this._apiWebhookService.pushReportNotification(report);
    await this._increaseTargetReportCount(targetType, targetUserId);

    return report;
  }

  // 신고 대상이 존재하는지 확인
  private async _checkValidTarget(
    targetType: ReportTargetType,
    targetId: number
  ) {
    this._log(`is valid ${targetType}? id: ${targetId}`);
    if (targetType === ReportTargetType.POST) {
      const isValidPost = await this._postService.isValid(targetId);
      if (!isValidPost) throw new NotFoundException("not exists post");
    }
    if (targetType === ReportTargetType.COMMENT) {
      const isValidComment = await this._commentService.isValid(targetId);
      if (!isValidComment) throw new NotFoundException("not exists comment");
    }
  }

  private async _increaseTargetReportCount(
    targetType: ReportTargetType,
    targetId: number
  ) {
    this._log(`increase ${targetType} report count id: ${targetId}`);
    if (targetType === ReportTargetType.POST) {
      await this._postService.increaseReportCount(targetId);
    }
    if (targetType === ReportTargetType.COMMENT) {
      await this._commentService.increaseReportCount(targetId);
    }
  }
}
