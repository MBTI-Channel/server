import { QueryDeepPartialEntity } from "typeorm/query-builder/QueryPartialEntity";
import { Provider } from "../../../shared/type.shared";
import {
  LoginDto,
  SignUpDto,
  NicknameDuplicateCheckDto,
  CreateUserDto,
  UserTokenResponseDto,
  TokenResponseDto,
  UserResponseDto,
} from "../dto";
import { User } from "../entity/user.entity";

export interface IUserService {
  create(dto: CreateUserDto): Promise<UserResponseDto>;
  findOneById(id: number): Promise<UserResponseDto | null>;
  findOneByProviderInfo(
    provider: Provider,
    providerId: string
  ): Promise<UserResponseDto | null>;
  update(
    id: number,
    payload: QueryDeepPartialEntity<User>
  ): Promise<UserResponseDto | null>;

  login(dto: LoginDto): Promise<UserTokenResponseDto>;
  signUp(dto: SignUpDto): Promise<UserTokenResponseDto>;
  isExistsNickname(dto: NicknameDuplicateCheckDto): Promise<boolean>;
  reissueAccessToken(accessToken: string): Promise<TokenResponseDto>;
}
