import { CreateUserDto } from "../dtos/create-user.dto";
import { NicknameDuplicateCheckDto } from "../dtos/nickname-duplicate-check.dto";
import { User } from "../entity/user.entity";
import { LoginDto } from "../dtos/login.dto";

export interface IUserService {
  login(dto: LoginDto): Promise<any>;
  create(dto: CreateUserDto): Promise<User>;
  findOne(payload: Partial<User>): Promise<User | null>;
  isExistsNickname(dto: NicknameDuplicateCheckDto): Promise<boolean>;
  reissueAccessToken(accessToken: string): Promise<any>;
}
