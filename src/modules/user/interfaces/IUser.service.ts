import { Provider } from "../../../shared/type.shared";
import {
  UserTokenResponseDto,
  UserResponseDto,
  NeedSignUpResponseDto,
} from "../dto";
import { User } from "../entity/user.entity";

export interface IUserService {
  create(
    provider: Provider,
    providerId: string,
    gender?: number,
    ageRange?: string
  ): Promise<NeedSignUpResponseDto>;
  //update(id: number, payload: Partial<User>): Promise<UserResponseDto | null>;
  //findOne
  login(id: number, providerId: string): Promise<UserTokenResponseDto>;
  signUp(
    id: number,
    uuid: string,
    nickname: string,
    mbti: string,
    userAgent: string
  ): Promise<UserTokenResponseDto>;
  reissueAccessToken(
    user: User,
    refreshToken: string,
    userAgent: string
  ): Promise<string>;
  isExistsNickname(nickname: string): Promise<boolean>;
  isValid(id: number): Promise<boolean>;
}
