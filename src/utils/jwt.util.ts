import { injectable } from "inversify";
import * as jwt from "jsonwebtoken";
import config from "../config/index";
import { DecodedDto } from "../modules/auth/dtos/decode-token.dto";
import { plainToInstance } from "class-transformer";

const { jwt: jwtConfig } = config;

@injectable()
export class JwtUtil {
  constructor() {}

  sign(payload: jwt.JwtPayload, options?: jwt.SignOptions) {
    if (options) return jwt.sign(payload, jwtConfig.secret, options);
    return jwt.sign(payload, jwtConfig.secret);
  }

  verify(token: string): DecodedDto {
    try {
      const decoded = jwt.verify(token, jwtConfig.secret);
      const dto = plainToInstance(DecodedDto, decoded);
      return dto;
    } catch (err) {
      const dto = plainToInstance(DecodedDto, {});
      return dto;
    }
  }

  decode(token: string): DecodedDto {
    const decodedToken = jwt.decode(token, {
      complete: false,
    });
    if (!decodedToken) {
      throw new Error("parse error");
    }
    const dto = plainToInstance(DecodedDto, decodedToken);
    return dto;
  }
}
