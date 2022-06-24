import { QueryDeepPartialEntity } from "typeorm/query-builder/QueryPartialEntity";
import { CreateUserDto } from "../dtos/create-user.dto";
import { NicknameDuplicateCheckDto } from "../dtos/nickname-duplicate-check.dto";
import { User } from "../entity/user.entity";
import { LoginDto } from "../dtos/login.dto";
import { SignUpDto } from "../dtos/sign-up.dto";

export interface IUserService {
  login(dto: LoginDto): Promise<any>;
  create(dto: CreateUserDto): Promise<User>;
  findOne(payload: Partial<User>): Promise<User | null>;
  update(
    id: number,
    payload: QueryDeepPartialEntity<User>
  ): Promise<User | null>;
  signUp(dto: SignUpDto): Promise<any>;
  isExistsNickname(dto: NicknameDuplicateCheckDto): Promise<boolean>;
  reissueAccessToken(accessToken: string): Promise<any>;
}
