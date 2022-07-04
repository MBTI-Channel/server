import { inject, injectable } from "inversify";
import { DataSource, ObjectType, Repository } from "typeorm";
import { TYPES } from "../../core/type.core";
import { Logger } from "../utils/logger.util";
import appDataSource from "../../datasource";
import { IDatabaseService } from "./interfaces/IDatabase.service";

@injectable()
export class DatabaseService implements IDatabaseService {
  private static myDataSource: DataSource;
  constructor(@inject(TYPES.Logger) private readonly _logger: Logger) {}

  private async _getConnection(): Promise<DataSource> {
    if (DatabaseService.myDataSource?.isInitialized) {
      this._logger.trace(
        "[DatabaseService] database connection already established"
      );
      return DatabaseService.myDataSource;
    }

    try {
      DatabaseService.myDataSource = await appDataSource.initialize();
      this._logger.info("[DatabaseService] database connection established");
    } catch (err) {
      this._logger.error(
        err,
        `[DatabaseService] database connection failed. Error: ${err}`
      );
    }

    return DatabaseService.myDataSource;
  }

  public async init() {
    try {
      DatabaseService.myDataSource = await appDataSource.initialize();
      this._logger.info("[DatabaseService] database initialize success");
    } catch (err) {
      this._logger.error(
        err,
        `[DatabaseService] database initialize error. Error: ${err}`
      );
    }
    return;
  }

  public async getRepository(
    entity: ObjectType<any>
  ): Promise<Repository<any>> {
    const connection = await this._getConnection(); // _getConnection -> 연결 성공 후 앱 어디에서나 연결할 수 있음
    return await connection?.getRepository(entity);
  }
}
