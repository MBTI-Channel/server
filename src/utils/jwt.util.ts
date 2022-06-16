import * as jwt from "jsonwebtoken";
import config from "../config/index";

const { jwt: jwtConfig } = config;

export class JwtUtils {
  constructor() {}

  sign(payload: jwt.JwtPayload, options?: jwt.SignOptions) {
    if (options) return jwt.sign(payload, jwtConfig.secret, options);
    return jwt.sign(payload, jwtConfig.secret);
  }
}
