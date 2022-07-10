import { inject, injectable } from "inversify";
import { QueryDeepPartialEntity } from "typeorm/query-builder/QueryPartialEntity";
import { TYPES } from "../../core/type.core";
import { IDatabaseService } from "../../shared/database/interfaces/IDatabase.service";
import { IUserRepository } from "./interfaces/IUser.repository";
import { User } from "./entity/user.entity";
import { Provider } from "../../shared/type.shared";

@injectable()
export class UserRepository implements IUserRepository {
  constructor(
    @inject(TYPES.IDatabaseService) private readonly _database: IDatabaseService
  ) {}

  async createEntity(
    provider: Provider,
    providerId: string,
    gender: number,
    ageRange: string
  ) {
    const repository = await this._database.getRepository(User);
    const userEntity = await repository.create({
      provider,
      providerId,
      gender,
      ageRange,
    });

    return userEntity;
  }

  async create(userEntity: User): Promise<User> {
    const repository = await this._database.getRepository(User);
    const user = await repository.save(userEntity);
    return user;
  }

  async findOneById(id: number): Promise<User | null> {
    const repository = await this._database.getRepository(User);
    return await repository.findOne({ where: { id } });
  }

  async findOneByNickname(nickname: string): Promise<User | null> {
    const repository = await this._database.getRepository(User);
    return await repository.findOne({ where: { nickname } });
  }

  async findOneByProviderInfo(
    provider: Provider,
    providerId: string
  ): Promise<User | null> {
    const repository = await this._database.getRepository(User);
    return await repository.findOne({ where: { provider, providerId } });
  }

  async findAllByProviderInfo(
    provider: Provider,
    providerId: string
  ): Promise<User[]> {
    const repository = await this._database.getRepository(User);
    return await repository.find({ where: { provider, providerId } });
  }

  async findOneStatus(id: number): Promise<User | null> {
    const repository = await this._database.getRepository(User);
    return await repository.findOne({
      select: ["id", "status"],
      where: { id },
    });
  }

  async update(id: number, payload: Partial<User>): Promise<User> {
    const repository = await this._database.getRepository(User);
    const updatedUser = await repository
      .update(id, payload as QueryDeepPartialEntity<User>)
      .then(async () => await repository.findOne({ where: { id } }));
    return updatedUser;
  }
}
