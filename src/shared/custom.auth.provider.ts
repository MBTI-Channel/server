import { inject, injectable } from "inversify";
import { interfaces } from "inversify-express-utils";
import { Request, Response, NextFunction } from "express";
import { Principal } from "./user.shared";
import { JwtUtil } from "../utils/jwt.util";
import { TYPES } from "../core/type.core";
import { UserService } from "../modules/user/user.service";

@injectable()
export class CustomAuthProvider implements interfaces.AuthProvider {
  @inject(TYPES.JwtUtil) private readonly jwtUtil: JwtUtil;
  @inject(TYPES.IUserService) private readonly userService: UserService;

  public async getUser(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Principal> {
    const accessToken = req.headers?.authorization?.replace("Bearer ", "")!;

    let decoded = this.jwtUtil.decode(accessToken);
    const user = await this.userService.findOne({ id: decoded.id });
    const principal = new Principal(user);

    return principal;
  }
}
