import { inject } from "inversify";
import { RedisClientType } from "@redis/client";
import { injectable } from "inversify";
import { IRedisService } from "./interfaces/IRedis.service";
import { createClient } from "redis";
import { TYPES } from "../../core/type.core";
import { Logger } from "../../utils/logger.util";
import config from "../../config/index";

const { redis } = config;

@injectable()
export class RedisService implements IRedisService {
  private static client: RedisClientType;
  constructor(@inject(TYPES.Logger) private readonly logger: Logger) {}

  public async init() {
    RedisService.client = createClient({
      url: `redis://${redis.redisUserName}:${redis.redisPassword}@${redis.redisHost}:${redis.redisPort}`,
    });
    RedisService.client.on("error", (err) => {
      this.logger.error(err, `redis connection failed. Error: ${err}`);
      RedisService.client.QUIT();
    });
    await RedisService.client.connect();
  }

  // test용 임의로 둔 set
  public async set(key: string, value: string) {
    await RedisService.client.set(key, value);
  }

  // test용 임의로 둔 get
  public async get(key: string) {
    const value = await RedisService.client.get(key);
    if (!value) {
      return `no ${key} in redis_db`;
    }
    return value;
  }
}
