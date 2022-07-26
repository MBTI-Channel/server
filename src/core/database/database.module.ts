import { ContainerModule } from "inversify";
import { TYPES } from "../types.core";
import { DatabaseService } from "./database.service";
import { RedisService } from "./redis.service";
import { IDatabaseService } from "./interfaces/IDatabase.service";
import { IRedisService } from "./interfaces/IRedis.service";

export const databaseModule = new ContainerModule((bind) => {
  bind<IDatabaseService>(TYPES.IDatabaseService).to(DatabaseService);
  bind<IRedisService>(TYPES.IRedisService).to(RedisService);
});
