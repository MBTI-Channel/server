import { JwtPayload } from "jsonwebtoken";
import config from "../../../config";

export interface ITokenPayload extends JwtPayload {
  id?: number;
  nickname?: string;
  mbti?: string;
  isAdmin?: boolean;
  iss: string;
}
