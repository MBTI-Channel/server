import { ContainerModule } from "inversify";
import { TYPES } from "../../core/type.core";
import { IUserRepository } from "./interfaces/IUser.repository";
import { IUserService } from "./interfaces/IUser.service";
import { UserRepository } from "./user.repository";
import { UserService } from "./user.service";

export const userModule = new ContainerModule((bind) => {
  bind<IUserService>(TYPES.IUserService).to(UserService);
  bind<IUserRepository>(TYPES.IUserRepository).to(UserRepository);
});
