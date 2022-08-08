import { inject, injectable } from "inversify";
import { IDatabaseService } from "../../core/database/interfaces/IDatabase.service";
import { TYPES } from "../../core/types.core";
import { Report } from "./entity/report.entity";
import { IReportRepository } from "./interfaces/IReport.repository";

@injectable()
export class ReportRepository implements IReportRepository {
  constructor(
    @inject(TYPES.IDatabaseService) private readonly _database: IDatabaseService
  ) {}

  public async createReport(reportEntity: Report): Promise<Report> {
    const repository = await this._database.getRepository(Report);
    return await repository.save(reportEntity);
  }
}
