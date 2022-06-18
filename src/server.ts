import express, { NextFunction, Request, Response } from "express";
import helmet from "helmet";
import morgan from "morgan";
import { InversifyExpressServer } from "inversify-express-utils";
import container from "./core/container.core";
import { TYPES } from "./core/type.core";
import { DatabaseService } from "./modules/database/database.service";
import { Logger } from "./utils/logger.util";
import { HttpException } from "./errors/http.exception";

export const server = new InversifyExpressServer(container);

const loggerInstance = container.get<Logger>(TYPES.Logger);
const databaseInstance = container.get<DatabaseService>(TYPES.IDatabaseService);

server.setConfig((app) => {
  databaseInstance.init();
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(helmet());
  app.use(
    morgan("combined", {
      stream: {
        write: (message) => loggerInstance.morganStream(message),
      },
    })
  );
});

server.setErrorConfig((app) => {
  app.use((req: Request, res: Response, next: NextFunction) => {
    return res.status(404).end();
  });

  app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof HttpException) {
      const { name, status, message, info } = err;
      return res.status(status).json({ name, message, info });
    }
    loggerInstance.error(err.message, err.stack);
    return res.status(500).json({ message: "server error :(" });
  });
});
