import { CreateUserDto } from "../dtos/create-user.dto";
import { User } from "../entity/user.entity";

export interface IUserRepository {
  create(dto: CreateUserDto): Promise<User>;
  findOne(payload: Partial<User>): Promise<User | null>;
}
