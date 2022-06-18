import { inject, injectable } from "inversify";
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

  async create(dto: CreateUserDto) {
    const repository = await this.database.getRepository(User);
    const user = await repository.create(dto);
    await repository.insert(user);
    return user;
  }

  async findOne(payload: Partial<User>): Promise<User> {
    const repository = await this.database.getRepository(User);
    return await repository.findOne({ where: payload });
  }
}
