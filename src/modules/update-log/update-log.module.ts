import { ContainerModule } from "inversify";
import { TYPES } from "../../core/types.core";
import { IUpdateLogRepository } from "./interfaces/IUpdate-log.repository";
import { IUpdateLogService } from "./interfaces/IUpdate-log.service";
import { UdpateLogRepository } from "./update-log.repository";
import { UpdateLogService } from "./update-log.service";

export const updateLogModule = new ContainerModule((bind) => {
  bind<IUpdateLogService>(TYPES.IUpdateLogService).to(UpdateLogService);
  bind<IUpdateLogRepository>(TYPES.IUpdateLogRepository).to(
    UdpateLogRepository
  );
});
