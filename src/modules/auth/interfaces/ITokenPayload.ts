import { JwtPayload } from "jsonwebtoken";

export interface ITokenPayload extends JwtPayload {
  id?: number;
  nickname?: string;
  mbti?: string;
  isAdmin?: boolean;
  iss?: string;
}
