import { Application, json, urlencoded } from "express";
import { Container } from "inversify";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";
import { join } from "path";
import { TYPES } from "./types.core";
import { Logger } from "../shared/utils/logger.util";

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

export default (app: Application, container: Container) => {
  const logger = container.get<Logger>(TYPES.Logger);
  app.set("trust proxy", true);
  app.use(json());
  app.use(urlencoded({ extended: true }));
  app.use(helmet());
  app.use(cookieParser());
  app.use(cors(corsOptions));
  app.use(
    morgan("combined", {
      stream: {
        write: (message) => logger.morganStream(message),
      },
    })
  );
  if (process.env.NODE_ENV === "development") {
    const swaggerYaml = YAML.load(join(__dirname, "../swagger.yaml"));
    app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerYaml));
  }
};
