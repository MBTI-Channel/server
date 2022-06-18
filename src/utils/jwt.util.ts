import { injectable } from "inversify";
import * as jwt from "jsonwebtoken";
import config from "../config/index";

const { jwt: jwtConfig } = config;

@injectable()
export class JwtUtil {
  constructor() {}

  sign(payload: jwt.JwtPayload, options?: jwt.SignOptions) {
    if (options) return jwt.sign(payload, jwtConfig.secret, options);
    return jwt.sign(payload, jwtConfig.secret);
  }
}
