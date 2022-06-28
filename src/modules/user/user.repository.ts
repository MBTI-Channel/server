import { inject, injectable } from "inversify";
import { QueryDeepPartialEntity } from "typeorm/query-builder/QueryPartialEntity";
import { TYPES } from "../../core/type.core";
import { IDatabaseService } from "../database/interfaces/IDatabase.service";
import { IUserRepository } from "./interfaces/IUser.repository";
import { CreateUserDto } from "./dto";
import { Provider, User } from "./entity/user.entity";

@injectable()
export class UserRepository implements IUserRepository {
  constructor(
    @inject(TYPES.IDatabaseService) private readonly database: IDatabaseService
  ) {}

  async create(dto: CreateUserDto): Promise<User> {
    const repository = await this.database.getRepository(User);
    const user = await repository.create(dto);
    await repository.insert(user);
    return user;
  }

  async findOneById(id: number): Promise<User | null> {
    const repository = await this.database.getRepository(User);
    return await repository.findOne({ where: { id } });
  }

  async findOneByNickname(nickname: string): Promise<User | null> {
    const repository = await this.database.getRepository(User);
    return await repository.findOne({ where: { nickname } });
  }

  async findOneByProviderInfo(
    provider: Provider,
    providerId: string
  ): Promise<User | null> {
    const repository = await this.database.getRepository(User);
    return await repository.findOne({ where: { provider, providerId } });
  }

  async update(
    id: number,
    payload: QueryDeepPartialEntity<User>
  ): Promise<User> {
    const repository = await this.database.getRepository(User);
    const updatedUser = await repository
      .update(id, payload)
      .then(async () => await repository.findOne({ where: { id } }));
    return updatedUser;
  }
}
