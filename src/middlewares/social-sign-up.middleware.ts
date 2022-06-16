import { NextFunction, Request, Response } from "express";
import { inject, injectable } from "inversify";
import { BaseMiddleware } from "inversify-express-utils";
import { DatabaseService } from "../core/services/database.service";
import { TYPES } from "../core/type.core";
import { User } from "../entities/user.entity";
import { UnauthorizedException } from "../errors/all.exception";
import { Logger } from "../utils/logger.util";

@injectable()
export class SocialSignUp extends BaseMiddleware {
  @inject(TYPES.Logger) private readonly logger: Logger;
  @inject(TYPES.IDatabaseService)
  private readonly databaseService: DatabaseService;

  public async handler(req: Request, res: Response, next: NextFunction) {
    if (!req.user) throw new UnauthorizedException("authentication error");

    const { provider, providerId, providerData } = req.user;

    const UserRepository = await this.databaseService.getRepository(User);
    const user = await UserRepository.findOne({
      where: {
        provider,
        providerId,
      },
    });

    // user가 db에 없으면 새로 생성 후 저장
    if (!user) {
      const newUser = await UserRepository.create({
        provider,
        providerId,
        providerData,
      });
      await UserRepository.save(newUser);
      return res.status(200).json({
        id: newUser.id,
        message: "need sign up",
      });
    }

    if (!user.nickname || !user.mbti) {
      return res.status(200).json({
        id: user.id,
        message: "need sign up",
      });
    }
    return next();
  }
}
