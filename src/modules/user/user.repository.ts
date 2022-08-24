import { inject, injectable } from "inversify";
import { QueryDeepPartialEntity } from "typeorm/query-builder/QueryPartialEntity";
import { TYPES } from "../../core/types.core";
import { IDatabaseService } from "../../core/database/interfaces/IDatabase.service";
import { IUserRepository } from "./interfaces/IUser.repository";
import { User } from "./entity/user.entity";
import { Provider } from "../../shared/type.shared";

@injectable()
export class UserRepository implements IUserRepository {
  constructor(
    @inject(TYPES.IDatabaseService) private readonly _database: IDatabaseService
  ) {}

  public async create(userEntity: User): Promise<User> {
    const repository = await this._database.getRepository(User);
    const user = await repository.save(userEntity);
    return user;
  }

  public async findOneById(id: number): Promise<User | null> {
    const repository = await this._database.getRepository(User);
    return await repository.findOne({ where: { id } });
  }

  public async findOneByNickname(nickname: string): Promise<User | null> {
    const repository = await this._database.getRepository(User);
    return await repository.findOne({ where: { nickname } });
  }

  public async findOneByProviderInfo(
    provider: Provider,
    providerId: string
  ): Promise<User | null> {
    const repository = await this._database.getRepository(User);
    return await repository.findOne({ where: { provider, providerId } });
  }

  public async findAllByProviderInfo(
    provider: Provider,
    providerId: string
  ): Promise<User[]> {
    const repository = await this._database.getRepository(User);
    return await repository.find({ where: { provider, providerId } });
  }

  public async findOneStatus(id: number): Promise<User | null> {
    const repository = await this._database.getRepository(User);
    return await repository.findOne({
      select: ["id", "status"],
      where: { id },
    });
  }

  public async update(id: number, payload: Partial<User>): Promise<boolean> {
    const repository = await this._database.getRepository(User);
    const result = await repository.update(
      id,
      payload as QueryDeepPartialEntity<User>
    );
    if (result.affected == 1) return true;
    return false;
  }
}
