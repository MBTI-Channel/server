import { QueryDeepPartialEntity } from "typeorm/query-builder/QueryPartialEntity";
import { CreateUserDto } from "../dto";
import { User } from "../entity/user.entity";

export interface IUserRepository {
  create(dto: CreateUserDto): Promise<User>;
  findOne(payload: Partial<User>): Promise<User | null>;
  update(id: number, payload: QueryDeepPartialEntity<User>): Promise<User>;
}
