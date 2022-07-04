import { QueryDeepPartialEntity } from "typeorm/query-builder/QueryPartialEntity";
import { Provider } from "../../../shared/type.shared";
import { User } from "../entity/user.entity";

export interface IUserRepository {
  createEntity(
    provider: Provider,
    providerId: string,
    gender?: number,
    ageRange?: string
  ): Promise<QueryDeepPartialEntity<User>>;
  create(
    userEntity: QueryDeepPartialEntity<User>
  ): Promise<QueryDeepPartialEntity<User>>;
  findOneById(id: number): Promise<User | null>;
  findOneByNickname(nickname: string): Promise<User | null>;
  findOneByProviderInfo(
    provider: Provider,
    providerId: string
  ): Promise<User | null>;
  update(id: number, payload: QueryDeepPartialEntity<User>): Promise<User>;
}
