import { Mbti } from "../../../shared/enum.shared";
import { Provider } from "../../../shared/type.shared";
import {
  UserTokenResponseDto,
  NeedSignUpResponseDto,
  AccessTokenResponseDto,
} from "../dto";
import { User } from "../entity/user.entity";

export interface IUserService {
  create(
    provider: Provider,
    providerId: string,
    gender?: number,
    ageRange?: string
  ): Promise<NeedSignUpResponseDto>;
  updateNickname(user: User, nickname: string): Promise<AccessTokenResponseDto>;
  updateMbti(user: User, mbti: Mbti): Promise<any>;
  login(
    id: number,
    providerId: string,
    userAgent: string
  ): Promise<UserTokenResponseDto>;
  logout(id: number, refreshToken: string, userAgent: string): Promise<void>;
  signUp(
    id: number,
    uuid: string,
    nickname: string,
    mbti: string,
    userAgent: string
  ): Promise<UserTokenResponseDto>;
  leave(id: number, refreshToken: string, userAgent: string): Promise<void>;
  reissueAccessToken(
    user: User,
    refreshToken: string,
    userAgent: string
  ): Promise<AccessTokenResponseDto>;
  checkDuplicateNickname(nickname: string): Promise<void>;
  isValid(id: number): Promise<boolean>;
}
