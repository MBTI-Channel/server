import { ReportTargetType } from "../../../shared/enum.shared";
import { User } from "../../user/entity/user.entity";
import { Report } from "../entity/report.entity";

export interface IReportService {
  createReport(
    user: User,
    targetId: number,
    targetType: ReportTargetType,
    targetUserId: number,
    reason: string
  ): Promise<Report>;
}
