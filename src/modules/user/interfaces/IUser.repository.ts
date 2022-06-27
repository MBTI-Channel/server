import { QueryDeepPartialEntity } from "typeorm/query-builder/QueryPartialEntity";
import { CreateUserDto } from "../dto";
import { Provider, User } from "../entity/user.entity";

export interface IUserRepository {
  create(dto: CreateUserDto): Promise<User>;
  findOneById(id: number): Promise<User | null>;
  findOneByNickname(nickname: string): Promise<User | null>;
  findOneByProviderInfo(
    provider: Provider,
    providerId: string
  ): Promise<User | null>;
  update(id: number, payload: QueryDeepPartialEntity<User>): Promise<User>;
}
