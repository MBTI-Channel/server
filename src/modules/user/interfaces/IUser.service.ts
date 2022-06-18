import { CreateUserDto } from "../dtos/create-user.dto";
import { User } from "../entity/user.entity";

export interface IUserService {
  create(dto: CreateUserDto): Promise<User>;
  findOne(payload: Partial<User>): Promise<User>;
}
