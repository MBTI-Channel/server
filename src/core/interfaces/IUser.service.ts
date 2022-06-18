import { ObjectType, Repository } from "typeorm";
import { LoginDto } from "../../dtos/auth/oauth-login.dto";
import { User } from "../../entities/user.entity";

export interface IUserService {
  findOne(loginDto: LoginDto): Promise<User>;
}
