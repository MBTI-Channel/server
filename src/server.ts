import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import { InversifyExpressServer } from "inversify-express-utils";
import container from "./core/container.core";
import { TYPES } from "./core/type.core";
import { DatabaseService } from "./core/services/database.service";
import { Logger } from "./utils/logger.util";

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
