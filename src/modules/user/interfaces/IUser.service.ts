import { Provider } from "../../../shared/type.shared";
import {
  UserTokenResponseDto,
  TokenResponseDto,
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
  findOneById(id: number): Promise<UserResponseDto | null>;
  findOneByProviderInfo(
    provider: Provider,
    providerId: string
  ): Promise<UserResponseDto | null>;
  update(id: number, payload: Partial<User>): Promise<UserResponseDto | null>;
  login(id: number, providerId: string): Promise<UserTokenResponseDto>;
  signUp(
    id: number,
    uuid: string,
    nickname: string,
    mbti: string
  ): Promise<UserTokenResponseDto>;
  reissueAccessToken(accessToken: string): Promise<TokenResponseDto>;
  isExistsNickname(nickname: string): Promise<boolean>;
  isValid(id: number): Promise<boolean>;
}
