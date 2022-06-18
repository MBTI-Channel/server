import { NextFunction, Request, Response } from "express";
import { inject, injectable } from "inversify";
import { BaseMiddleware } from "inversify-express-utils";
import { TYPES } from "../core/type.core";
import { User } from "../modules/user/entity/user.entity";
import { UnauthorizedException } from "../errors/all.exception";
import { Logger } from "../utils/logger.util";
import { IUserService } from "../modules/user/interfaces/IUser.service";
import { CreateUserDto } from "../modules/user/dtos/create-user.dto";

@injectable()
export class SocialSignUp extends BaseMiddleware {
  @inject(TYPES.Logger) private readonly logger: Logger;
  @inject(TYPES.IUserService) private readonly userService: IUserService;
  public async handler(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) throw new UnauthorizedException("authentication error");

      const providerUserInfo = req.user as User;
      // TODO: 리팩토링 필요
      const foundUser = await this.isExistsUser(providerUserInfo);
      if (!foundUser) {
        const newUser = await this.userService.create(
          providerUserInfo as CreateUserDto
        );
        return res.status(200).json({
          id: newUser.id,
          message: "need sign up",
        });
      }
      if (!foundUser.nickname || !foundUser.mbti) {
        return res.status(200).json({
          id: foundUser.id,
          message: "need sign up",
        });
      }
      return next();
    } catch (err) {
      return next(err);
    }
  }

  private async isExistsUser(providerUserInfo: User): Promise<User | null> {
    const { provider, providerId } = providerUserInfo;
    try {
      const user = await this.userService.findOne({ provider, providerId });
      return user;
    } catch (err) {
      this.logger.http("not exsits user. need sign up");
      return null;
    }
  }
}
