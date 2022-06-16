import { Request, Response } from "express";
import {
  BaseHttpController,
  controller,
  httpPost,
} from "inversify-express-utils";
import { TYPES } from "../core/type.core";

@controller("/auth")
export class AuthController extends BaseHttpController {
  @httpPost("/login", TYPES.GetProviderUserByOauthMiddleware)
  async oauthLogin(req: Request, res: Response) {}
}
