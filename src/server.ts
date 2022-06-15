import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import { InversifyExpressServer } from "inversify-express-utils";
import container from "./core/container.core";
import { Logger } from "./utils/logger.util";
import { TYPES } from "./core/type.core";

export const server = new InversifyExpressServer(container);

server.setConfig((app) => {
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(helmet());
  app.use(
    morgan("combined", {
      stream: {
        write: (message) =>
          container.get<Logger>(TYPES.Logger).morganStream(message),
      },
    })
  );
});
