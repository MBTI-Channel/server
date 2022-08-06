import { injectable } from "inversify";
import jwt from "jsonwebtoken";
import config from "../../config/index";
import { DecodedDto } from "../../modules/auth/dto/decode-token.dto";
import { plainToInstance } from "class-transformer";

const { jwt: jwtConfig } = config;

@injectable()
export class JwtUtil {
  constructor() {}

  public sign(payload: jwt.JwtPayload, options?: jwt.SignOptions) {
    if (options) return jwt.sign(payload, jwtConfig.secret, options);
    return jwt.sign(payload, jwtConfig.secret);
  }

  public verify(token: string): DecodedDto {
    let dto: DecodedDto;
    try {
      let decoded = jwt.verify(token, jwtConfig.secret);
      dto = plainToInstance(DecodedDto, decoded);
      dto.status = "success";
    } catch (err) {
      dto = plainToInstance(DecodedDto, {});
      if (err instanceof jwt.TokenExpiredError) {
        dto.status = "expired";
      } else {
        dto.status = "invalid";
      }
    }
    return dto;
  }

  public decode(token: string): DecodedDto | null {
    try {
      let decodedToken = jwt.decode(token, {
        complete: false,
      });
      return plainToInstance(DecodedDto, decodedToken);
    } catch (err) {
      return null; // 잘못된 토큰이면 어차피 jwt.decode가 null 반환함
    }
  }
}
