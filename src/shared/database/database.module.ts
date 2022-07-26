import { ContainerModule } from "inversify";
import { TYPES } from "../../core/type.core";
import { DatabaseService } from "./database.service";
import { IDatabaseService } from "./interfaces/IDatabase.service";

export const databaseModule = new ContainerModule((bind) => {
  bind<IDatabaseService>(TYPES.IDatabaseService).to(DatabaseService);
});
