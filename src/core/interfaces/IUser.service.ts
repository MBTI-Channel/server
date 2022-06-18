import { LoginDto } from "../../dtos/user/login.dto";
import { User } from "../../entities/user.entity";

export interface IUserService {
  findOne(loginDto: LoginDto): Promise<User>;
}
