import { ContainerModule } from "inversify";
import { TYPES } from "../../core/types.core";
import { IReportRepository } from "./interfaces/IReport.repository";
import { IReportService } from "./interfaces/IReport.service";
import { ReportRepository } from "./report.repository";
import { ReportService } from "./report.service";

export const reportModule = new ContainerModule((bind) => {
  bind<IReportService>(TYPES.IReportService).to(ReportService);
  bind<IReportRepository>(TYPES.IReportRepository).to(ReportRepository);
});
