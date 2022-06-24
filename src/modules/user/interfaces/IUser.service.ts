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
  findOne(payload: Partial<User>): Promise<User | null>;
  update(
    id: number,
    payload: QueryDeepPartialEntity<User>
  ): Promise<User | null>;
  login(dto: LoginDto): Promise<any>;
  signUp(dto: SignUpDto): Promise<any>;
  isExistsNickname(dto: NicknameDuplicateCheckDto): Promise<boolean>;
  reissueAccessToken(accessToken: string): Promise<any>;
}
