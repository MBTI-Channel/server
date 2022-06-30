import { QueryDeepPartialEntity } from "typeorm/query-builder/QueryPartialEntity";
import {
  LoginDto,
  SignUpDto,
  NicknameDuplicateCheckDto,
  CreateUserDto,
} from "../dto";
import { User } from "../entity/user.entity";

export interface IUserService {
  create(dto: CreateUserDto): Promise<User>;
  findOneById(id: number): Promise<User | null>;
  findOneByProviderInfo(dto: LoginDto): Promise<User | null>;
  update(
    id: number,
    payload: QueryDeepPartialEntity<User>
  ): Promise<User | null>;
  login(dto: LoginDto): Promise<any>;
  signUp(dto: SignUpDto): Promise<any>;
  isExistsNickname(dto: NicknameDuplicateCheckDto): Promise<boolean>;
  reissueAccessToken(accessToken: string): Promise<any>;
}
