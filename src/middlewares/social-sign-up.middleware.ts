import { NextFunction, Request, Response } from "express";
import { inject, injectable } from "inversify";
import { BaseMiddleware } from "inversify-express-utils";
import { TYPES } from "../core/type.core";
import { IUserService } from "../modules/user/interfaces/IUser.service";
import { IUserRepository } from "../modules/user/interfaces/IUser.repository";
import { UserBase } from "../modules/user/entity/userbase";
import { Logger } from "../shared/utils/logger.util";
import { UnauthorizedException } from "../shared/errors/all.exception";
import config from "../config";

@injectable()
export class SocialSignUp extends BaseMiddleware {
  @inject(TYPES.Logger) private readonly _logger: Logger;
  @inject(TYPES.IUserService) private readonly _userService: IUserService;
  @inject(TYPES.IUserRepository)
  private readonly _userRepository: IUserRepository;

  public async handler(req: Request, res: Response, next: NextFunction) {
    try {
      this._logger.trace(`[SocialSignUp] start`);
      this._logger.trace(`[SocialSignUp] check if 'req.user' exists`);
      // err: req.err 없음
      if (!req.user) throw new UnauthorizedException("authentication error");

      const { provider, providerId, gender, ageRange } = req.user as UserBase;

      this._logger.trace(
        `[SocialSignUp] find all user who provider && providerId match in database`
      );
      const userArray = await this._userRepository.findAllByProviderInfo(
        provider,
        providerId
      );

      // userArray = [] or [ User{} , User{} ]
      const user = userArray.find(
        (u) => u.status !== config.user.status.withdrawal
      );

      // status !== withdrawal인 user가 하나도 없다면 create 후 need sign up 응답
      if (!user) {
        this._logger.trace(
          `[SocialSignUp] matching user in 'provider info' does not exist`
        );
        const newUser = await this._userService.create(
          provider,
          providerId,
          gender,
          ageRange
        );
        return res.status(201).json({
          message: "need sign up",
          ...newUser,
        });
      }

      // status === new || !nickname || !mbti => need sign up 응답
      if (
        user.status === config.user.status.new ||
        !user.nickname ||
        !user.mbti
      ) {
        this._logger.trace(`[SocialSignUp] user id ${user.id} requires signup`);
        return res.status(200).json({
          message: "need sign up",
          id: user.id,
          uuid: user.uuid,
        });
      }

      this._logger.trace(`[SocialSignUp] call next`);
      return next();
    } catch (err) {
      return next(err);
    }
  }
}
