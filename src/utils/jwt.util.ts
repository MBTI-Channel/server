import { injectable } from "inversify";
import * as jwt from "jsonwebtoken";
import config from "../config/index";
import { DecodedDto } from "../modules/auth/dtos/decode-token.dto";
import { plainToInstance } from "class-transformer";
import { parse } from "path";

const { jwt: jwtConfig } = config;

const secret: string = jwtConfig.secret;

@injectable()
export class JwtUtil {
  constructor() {}

  sign(payload: jwt.JwtPayload, options?: jwt.SignOptions) {
    if (options) return jwt.sign(payload, jwtConfig.secret, options);
    return jwt.sign(payload, jwtConfig.secret);
  }

  verify(token: string): boolean {
    let isValidate = true;
    jwt.verify(token, jwtConfig.secret, (error: any, decoded: any) => {
      if (error) {
        isValidate = false;
      }
    });
    return isValidate;
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
