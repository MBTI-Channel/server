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
      this._logger.trace(`[SocialSignUp] start`);
      // req.user 없다면 인증 에러
      this._logger.trace(`[SocialSignUp] check if 'req.user' exists`);
      if (!req.user) throw new UnauthorizedException("authentication error");
      const { provider, providerId, providerData } = req.user as User;

      this._logger.trace(
        `[SocialSignUp] checking if provider && providerId exists in database`
      );
      const foundUser = await this._userService.findOneByProviderInfo(
        provider,
        providerId!
      );

      // provider info에 해당하는 user가 없다면 생성후 need sign up 리턴
      if (!foundUser) {
        this._logger.trace(
          `[SocialSignUp] matching user in 'provider info' does not exist`
        );
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
        this._logger.trace(
          `[SocialSignUp] user id ${foundUser.id} is null 'mbti' or 'nickname'`
        );
        return res.status(200).json({
          id: foundUser.id,
          message: "need sign up",
        });
      }

      this._logger.trace(`[SocialSignUp] call next`);
      return next();
    } catch (err) {
      return next(err);
    }
  }
}
