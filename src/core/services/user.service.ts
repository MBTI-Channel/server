import { inject, injectable } from "inversify";
import { ObjectType, Repository } from "typeorm";
import { LoginDto } from "../../dtos/user/login.dto";
import { User } from "../../entities/user.entity";
import { IDatabaseService } from "../interfaces/IDatabase.service";
import { IUserService } from "../interfaces/IUser.service";
import { TYPES } from "../type.core";

@injectable()
export class UserService implements IUserService {
  constructor(
    @inject(TYPES.IDatabaseService)
    private readonly databaseService: IDatabaseService
  ) {}
  private async getRepository(
    entity: ObjectType<any>
  ): Promise<Repository<any>> {
    return await this.databaseService.getRepository(entity);
  }
  public async findOne(loginDto: LoginDto): Promise<User> {
    const UserRepository = await this.getRepository(User);
    const user = await UserRepository.findOne({
      where: loginDto,
    });
    return user;
  }
}
