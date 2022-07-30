import { NextFunction, Request, Response } from "express";
import { InversifyExpressServer } from "inversify-express-utils";
import container from "./core/container.core";
import loader from "./core/loader.core";
import { TYPES } from "./core/types.core";
import { IDatabaseService } from "./core/database/interfaces/IDatabase.service";
import { IRedisService } from "./core/database/interfaces/IRedis.service";
import { IApiWebhookService } from "./shared/api/interfaces/IApi-webhook.service";
import { Logger } from "./shared/utils/logger.util";
import { HttpException } from "./shared/errors/http.exception";
import config from "./config";

const loggerInstance = container.get<Logger>(TYPES.Logger);
const apiWebhookService = container.get<IApiWebhookService>(
  TYPES.IApiWebhookService
);

export async function bootstrap() {
  const server = new InversifyExpressServer(container);
  await container.get<IDatabaseService>(TYPES.IDatabaseService).init();
  await container.get<IRedisService>(TYPES.IRedisService).init();
  server
    .setConfig((app) => {
      loader(app, container);
    })
    .setErrorConfig((app) => {
      app.use((req: Request, res: Response, next: NextFunction) => {
        loggerInstance.warn(`throwing a 'not found' exception by '${req.ip}' `);
        return res.status(404).end();
      });

      app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
        if (err instanceof HttpException) {
          const { name, status, message, info } = err;
          return res.status(status).json({ name, message, info });
        }
        loggerInstance.error(err); // logging server error
        apiWebhookService.pushErrorNotification(err); // send error to Team Collaboration Tool
        return res.status(500).json({ message: "server error :(" });
      });
    })
    .build()
    .listen(config.port, () => console.log(`server on ${config.port}`));
}
