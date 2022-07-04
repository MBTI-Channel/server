import { Provider } from "../../../shared/type.shared";
import {
  UserTokenResponseDto,
  TokenResponseDto,
  UserResponseDto,
} from "../dto";
import { User } from "../entity/user.entity";

export interface IUserService {
  create(
    provider: Provider,
    providerId: string,
    gender?: number,
    ageRange?: string
  ): Promise<UserResponseDto>;
  findOneById(id: number): Promise<UserResponseDto | null>;
  findOneByProviderInfo(
    provider: Provider,
    providerId: string
  ): Promise<UserResponseDto | null>;
  update(id: number, payload: Partial<User>): Promise<UserResponseDto | null>;

  login(provider: Provider, providerId: string): Promise<UserTokenResponseDto>;
  signUp(
    id: number,
    nickname: string,
    mbti: string
  ): Promise<UserTokenResponseDto>;
  isExistsNickname(nickname: string): Promise<boolean>;
  reissueAccessToken(accessToken: string): Promise<TokenResponseDto>;
}
