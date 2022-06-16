import { Request, Response } from "express";
import { inject } from "inversify";
import {
  BaseHttpController,
  controller,
  httpPost,
} from "inversify-express-utils";
import { AuthService } from "../core/services/auth.service";
import { TYPES } from "../core/type.core";
import { User } from "../entities/user.entity";

@controller("/auth")
export class AuthController extends BaseHttpController {
  @inject(TYPES.IAuthService) private readonly authService: AuthService;

  @httpPost(
    "/login",
    TYPES.GetProviderUserByOauthMiddleware,
    TYPES.SocialSignUpMiddleware
  )
  async oauthLogin(req: Request, res: Response) {
    const { provider, providerId } = req.user as User;
    const { user, accessToken, refreshToken } = await this.authService.login(
      provider,
      providerId
    );
  }
}
