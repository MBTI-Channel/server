import { LoginDto } from "../../auth/dtos/login.dto";
import { User } from "../entity/user.entity";

export interface IUserService {
  findOne(loginDto: LoginDto): Promise<User>;
}
