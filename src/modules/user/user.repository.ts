import { inject, injectable } from "inversify";
import { QueryDeepPartialEntity } from "typeorm/query-builder/QueryPartialEntity";
import { TYPES } from "../../core/type.core";
import { IDatabaseService } from "../database/interfaces/IDatabase.service";
import { IUserRepository } from "./interfaces/IUser.repository";
import { CreateUserDto, LoginDto } from "./dto";
import { User } from "./entity/user.entity";

@injectable()
export class UserRepository implements IUserRepository {
  constructor(
    @inject(TYPES.IDatabaseService) private readonly _database: IDatabaseService
  ) {}

  async create(dto: CreateUserDto): Promise<User> {
    const repository = await this._database.getRepository(User);
    const user = await repository.create(dto);
    await repository.insert(user);
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

  async findOneByProviderInfo(dto: LoginDto): Promise<User | null> {
    const { provider, providerId } = dto;
    const repository = await this._database.getRepository(User);
    return await repository.findOne({ where: { provider, providerId } });
  }

  async update(
    id: number,
    payload: QueryDeepPartialEntity<User>
  ): Promise<User> {
    const repository = await this._database.getRepository(User);
    const updatedUser = await repository
      .update(id, payload)
      .then(async () => await repository.findOne({ where: { id } }));
    return updatedUser;
  }
}
