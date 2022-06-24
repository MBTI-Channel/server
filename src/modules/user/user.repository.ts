import { inject, injectable } from "inversify";
import { QueryDeepPartialEntity } from "typeorm/query-builder/QueryPartialEntity";
import { TYPES } from "../../core/type.core";
import { IDatabaseService } from "../database/interfaces/IDatabase.service";
import { CreateUserDto } from "./dtos/create-user.dto";
import { User } from "./entity/user.entity";
import { IUserRepository } from "./interfaces/IUser.repository";

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

  async findOne(payload: Partial<User>): Promise<User> {
    const repository = await this.database.getRepository(User);
    return await repository.findOne({ where: payload });
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
