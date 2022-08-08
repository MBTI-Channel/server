import { controller, httpPost, requestBody } from "inversify-express-utils";
import { Request, Response } from "express";
import { IReportService } from "./interfaces/IReport.service";
import { User } from "../user/entity/user.entity";
import { inject } from "inversify";
import { TYPES } from "../../core/types.core";
import { ReportDto } from "./dto";
import { bodyValidator } from "../../middlewares/validator.middleware";

@controller("/reports")
export class ReportController {
  constructor(
    @inject(TYPES.IReportService)
    private readonly _reportService: IReportService
  ) {}

  @httpPost("/", TYPES.ValidateAccessTokenMiddleware, bodyValidator(ReportDto))
  public async report(
    @requestBody() body: ReportDto,
    req: Request,
    res: Response
  ) {
    const user = req.user as User;
    const { targetId, targetType, targetUserId, reason } = body;

    const data = await this._reportService.createReport(
      user,
      targetId,
      targetType,
      targetUserId,
      reason
    );

    return res.status(201).json(data);
  }
}
