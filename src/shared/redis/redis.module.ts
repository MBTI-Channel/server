import { ContainerModule } from "inversify";
import { TYPES } from "../../core/type.core";
import { IRedisService } from "./interfaces/IRedis.service";
import { RedisService } from "./redis.service";

export const redisModule = new ContainerModule((bind) => {
  bind<IRedisService>(TYPES.IRedisService).to(RedisService);
});
