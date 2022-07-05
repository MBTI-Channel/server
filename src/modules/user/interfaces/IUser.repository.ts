import { Provider } from "../../../shared/type.shared";
import { User } from "../entity/user.entity";

export interface IUserRepository {
  createEntity(
    provider: Provider,
    providerId: string,
    gender?: number,
    ageRange?: string
  ): Promise<User>;
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
  update(id: number, payload: Partial<User>): Promise<User>;
}
