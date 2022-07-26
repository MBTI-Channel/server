import { ContainerModule } from "inversify";
import { TYPES } from "../../core/types.core";
import { ILoginLogRepository } from "./interfaces/ILogin-log.repository";
import { ILoginLogService } from "./interfaces/ILogin-log.service";
import { LoginLogRepository } from "./login-log.repository";
import { LoginLogService } from "./login-log.service";

export const loginLogModule = new ContainerModule((bind) => {
  bind<ILoginLogService>(TYPES.ILoginLogService).to(LoginLogService);
  bind<ILoginLogRepository>(TYPES.ILoginLogRepository).to(LoginLogRepository);
});
