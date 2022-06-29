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
  private static _client: RedisClientType;
  constructor(@inject(TYPES.Logger) private readonly _logger: Logger) {}

  public async init() {
    RedisService._client = createClient({
      url: `redis://${redis.redisUserName}:${redis.redisPassword}@${redis.redisHost}:${redis.redisPort}`,
    });
    RedisService._client.on("error", (err) => {
      this._logger.error(err, `redis connection failed. Error: ${err}`);
      RedisService._client.QUIT();
    });
    await RedisService._client.connect();
  }

  // test용 임의로 둔 set
  public async set(key: string, value: string) {
    await RedisService._client.set(key, value);
  }

  // test용 임의로 둔 get
  public async get(key: string) {
    const value = await RedisService._client.get(key);
    if (!value) {
      return `no ${key} in redis_db`;
    }
    return value;
  }
}
