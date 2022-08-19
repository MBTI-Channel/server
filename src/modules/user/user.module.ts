import { ContainerModule } from "inversify";
import { TYPES } from "../../core/types.core";
import { IUserRepository } from "./interfaces/IUser.repository";
import { IUserService } from "./interfaces/IUser.service";
import { UserRepository } from "./user.repository";
import { UserService } from "./user.service";
import { ILoginLogRepository } from "./login-log/interfaces/ILogin-log.repository";
import { ILoginLogService } from "./login-log/interfaces/ILogin-log.service";
import { LoginLogRepository } from "./login-log/login-log.repository";
import { LoginLogService } from "./login-log/login-log.service";
import { IUpdateLogRepository } from "./update-log/interfaces/IUpdate-log.repository";
import { IUpdateLogService } from "./update-log/interfaces/IUpdate-log.service";
import { UdpateLogRepository } from "./update-log/update-log.repository";
import { UpdateLogService } from "./update-log/update-log.service";

export const userModule = new ContainerModule((bind) => {
  // user
  bind<IUserService>(TYPES.IUserService).to(UserService);
  bind<IUserRepository>(TYPES.IUserRepository).to(UserRepository);
  // update log
  bind<IUpdateLogService>(TYPES.IUpdateLogService).to(UpdateLogService);
  bind<IUpdateLogRepository>(TYPES.IUpdateLogRepository).to(
    UdpateLogRepository
  );
  // login log
  bind<ILoginLogService>(TYPES.ILoginLogService).to(LoginLogService);
  bind<ILoginLogRepository>(TYPES.ILoginLogRepository).to(LoginLogRepository);
});
