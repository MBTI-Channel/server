import { Report } from "../entity/report.entity";

export interface IReportRepository {
  createReport(reportEntity: Report): Promise<Report>;
}
