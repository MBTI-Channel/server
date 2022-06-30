import { QueryDeepPartialEntity } from "typeorm/query-builder/QueryPartialEntity";
import { CreateUserDto, LoginDto } from "../dto";
import { User } from "../entity/user.entity";

export interface IUserRepository {
  create(dto: CreateUserDto): Promise<User>;
  findOneById(id: number): Promise<User | null>;
  findOneByNickname(nickname: string): Promise<User | null>;
  findOneByProviderInfo(dto: LoginDto): Promise<User | null>;
  update(id: number, payload: QueryDeepPartialEntity<User>): Promise<User>;
}
