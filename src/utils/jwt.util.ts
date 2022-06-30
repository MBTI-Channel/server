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
    let dto: DecodedDto;
    try {
      let decoded = jwt.verify(token, jwtConfig.secret);
      dto = plainToInstance(DecodedDto, decoded);
      dto.status = "success";
    } catch (err) {
      dto = plainToInstance(DecodedDto, {});
      if (err instanceof jwt.JsonWebTokenError) dto.status = "invalid";
      else if (err instanceof jwt.TokenExpiredError) dto.status = "expired";
    }
    return dto;
  }

  decode(token: string): DecodedDto {
    let dto: DecodedDto;
    try {
      let decodedToken = jwt.decode(token, {
        complete: false,
      });
      dto = plainToInstance(DecodedDto, decodedToken);
    } catch (err) {
      dto = plainToInstance(DecodedDto, {});
      if (err instanceof jwt.JsonWebTokenError) dto.status = "invalid";
      else if (err instanceof jwt.TokenExpiredError) dto.status = "expired";
    }
    return dto;
  }
}
