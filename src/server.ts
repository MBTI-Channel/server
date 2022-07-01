import express, { NextFunction, Request, Response } from "express";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import cors from "cors";
import { InversifyExpressServer } from "inversify-express-utils";
import container from "./core/container.core";
import { TYPES } from "./core/type.core";
import { DatabaseService } from "./modules/database/database.service";
import { Logger } from "./utils/logger.util";
import { HttpException } from "./errors/http.exception";
import { RedisService } from "./modules/redis/redis.service";
/* Swagger */
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";
import { join } from "path";
const swaggerYaml = YAML.load(join(__dirname, "./swagger.yaml"));

export const server = new InversifyExpressServer(container);

type StaticOrigin = boolean | string | RegExp | (boolean | string | RegExp)[];
const whitelist = ["http://localhost:3000"];
const corsOptions = {
  origin: (
    origin: string | undefined,
    cb: (err: Error | null, singleOrigin?: StaticOrigin) => void
  ) => {
    const isWhitelisted = origin && whitelist.indexOf(origin) !== -1;
    cb(null, isWhitelisted);
  },
  credentials: true, // allow request with cookie
};

const loggerInstance = container.get<Logger>(TYPES.Logger);
const databaseInstance = container.get<DatabaseService>(TYPES.IDatabaseService);
const redisInstance = container.get<RedisService>(TYPES.IRedisService);

server.setConfig((app) => {
  databaseInstance.init();
  redisInstance.init();
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(helmet());
  app.use(cookieParser());
  app.use(cors(corsOptions));
  app.use(
    morgan("combined", {
      stream: {
        write: (message) => loggerInstance.morganStream(message),
      },
    })
  );
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerYaml));
});

server.setErrorConfig((app) => {
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
    return res.status(500).json({ message: "server error :(" });
  });
});
