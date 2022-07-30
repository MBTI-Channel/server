import { InversifyExpressServer } from "inversify-express-utils";
import container from "./core/container.core";
import loader from "./core/loader.core";
import errorHandler from "./core/error-handler.core";
import { TYPES } from "./core/types.core";
import { IDatabaseService } from "./core/database/interfaces/IDatabase.service";
import { IRedisService } from "./core/database/interfaces/IRedis.service";
import config from "./config";

export async function bootstrap() {
  const server = new InversifyExpressServer(container);
  await container.get<IDatabaseService>(TYPES.IDatabaseService).init();
  await container.get<IRedisService>(TYPES.IRedisService).init();
  server
    .setConfig((app) => {
      loader(app, container);
    })
    .setErrorConfig((app) => {
      errorHandler(app, container);
    })
    .build()
    .listen(config.port, () => console.log(`server on ${config.port}`));
}
