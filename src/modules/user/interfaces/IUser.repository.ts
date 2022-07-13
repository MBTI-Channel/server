import { Provider } from "../../../shared/type.shared";
import { User } from "../entity/user.entity";

export interface IUserRepository {
  create(userEntity: User): Promise<User>;
  findOneById(id: number): Promise<User | null>;
  findOneByNickname(nickname: string): Promise<User | null>;
  findOneByProviderInfo(
    provider: Provider,
    providerId: string
  ): Promise<User | null>;
  findAllByProviderInfo(
    provider: Provider,
    providerId: string
  ): Promise<User[]>;
  findOneStatus(id: number): Promise<User | null>;
  update(id: number, payload: Partial<User>): Promise<User>;
}
