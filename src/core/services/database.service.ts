import { inject, injectable } from "inversify";
import { DataSource, ObjectType, Repository } from "typeorm";
import { TYPES } from "../type.core";
import { Logger } from "../../utils/logger.util";
import appDataSource from "../../datasource";
import { IDatabaseService } from "../interfaces/IDatabase.service";

@injectable()
export class DatabaseService implements IDatabaseService {
  private static myDataSource: DataSource;
  constructor(@inject(TYPES.Logger) private readonly logger: Logger) {}

  // private async getConnection(): Promise<DataSource> {
  //   if (DatabaseService.myDataSource?.isInitialized) {
  //     this.logger.info("Database Connection Already Established");
  //     return DatabaseService.myDataSource;
  //   }

  //   try {
  //     DatabaseService.myDataSource = await appDataSource.initialize();
  //     this.logger.info("Database Connection Established");
  //   } catch (error) {
  //     this.logger.error(`Database Connection Failed. Error: ${error}`);
  //   }

  //   return DatabaseService.myDataSource;
  // }
  public async init() {
    try {
      DatabaseService.myDataSource = await appDataSource.initialize();
      this.logger.info("typeorm initialize success");
    } catch (err) {
      this.logger.error("typeorm initialize error :", err);
    }
    return;
  }

  public async getRepository(
    entity: ObjectType<any>
  ): Promise<Repository<any>> {
    // const connection = await this.getConnection(); // getConnection -> 연결 성공 후 앱 어디에서나 연결할 수 있음
    // return await connection?.getRepository(entity);
    return await DatabaseService.myDataSource?.getRepository(entity);
  }
}
