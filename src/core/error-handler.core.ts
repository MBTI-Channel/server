import { Application, NextFunction, Request, Response } from "express";
import { Container } from "inversify";
import { TYPES } from "./types.core";
import { IApiWebhookService } from "../shared/api/interfaces/IApi-webhook.service";
import { HttpException } from "../shared/errors/http.exception";
import { Logger } from "../shared/utils/logger.util";

export default (app: Application, container: Container) => {
  const logger = container.get<Logger>(TYPES.Logger);
  const apiWebhookService = container.get<IApiWebhookService>(
    TYPES.IApiWebhookService
  );

  app.use((req: Request, res: Response, next: NextFunction) => {
    logger.warn(`throwing a 'not found' exception by '${req.ip}' `);
    return res.status(404).end();
  });

  app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof HttpException) {
      const { name, status, message, info } = err;
      return res.status(status).json({ name, message, info });
    }
    logger.error(err); // logging server error
    apiWebhookService.pushErrorNotification(err); // send error to Team Collaboration Tool
    return res.status(500).json({ message: "server error :(" });
  });
};
