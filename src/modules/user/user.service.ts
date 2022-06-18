import { inject, injectable } from "inversify";
import { User } from "./entity/user.entity";
import { IUserService } from "./interfaces/IUser.service";
import { TYPES } from "../../core/type.core";
import { IUserRepository } from "./interfaces/IUser.repository";
import { CreateUserDto } from "./dtos/create-user.dto";
import { NotFoundException } from "../../errors/all.exception";

@injectable()
export class UserService implements IUserService {
  constructor(
    @inject(TYPES.IUserRepository)
    private readonly userRepository: IUserRepository
  ) {}

  public async create(dto: CreateUserDto): Promise<User> {
    return await this.userRepository.create(dto);
  }

  public async findOne(payload: Partial<User>): Promise<User> {
    const user = await this.userRepository.findOne(payload);
    if (!user) throw new NotFoundException("not exists user");
    return user;
  }
}
