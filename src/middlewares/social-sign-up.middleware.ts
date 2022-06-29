import { NextFunction, Request, Response } from "express";
import { inject, injectable } from "inversify";
import { BaseMiddleware } from "inversify-express-utils";
import { plainToClass } from "class-transformer";
import { TYPES } from "../core/type.core";
import { User } from "../modules/user/entity/user.entity";
import { UnauthorizedException } from "../errors/all.exception";
import { Logger } from "../utils/logger.util";
import { IUserService } from "../modules/user/interfaces/IUser.service";
import { CreateUserDto } from "../modules/user/dto/create-user.dto";

@injectable()
export class SocialSignUp extends BaseMiddleware {
  @inject(TYPES.Logger) private readonly _logger: Logger;
  @inject(TYPES.IUserService) private readonly _userService: IUserService;

  public async handler(req: Request, res: Response, next: NextFunction) {
    try {
      // req.user 없다면 인증 에러
      if (!req.user) throw new UnauthorizedException("authentication error");
      const { provider, providerId, providerData } = req.user as User;

      const foundUser = await this._userService.findOneByProviderInfo(
        provider,
        providerId!
      );

      // provider info에 해당하는 user가 없다면 생성후 need sign up 리턴
      if (!foundUser) {
        const dto = plainToClass(CreateUserDto, {
          provider,
          providerId,
          providerData,
        });
        const newUser = await this._userService.create(dto);

        return res.status(201).json({
          id: newUser.id,
          message: "need sign up",
        });
      }

      // user의 nickname || mbti가 없다면 need sign up 리턴
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
}
