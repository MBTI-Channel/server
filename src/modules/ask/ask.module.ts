import { ContainerModule } from "inversify";
import { TYPES } from "../../core/types.core";
import { AskRepository } from "./ask.repository";
import { AskService } from "./ask.service";
import { IAskRepository } from "./interfaces/IAsk.repository";
import { IAskService } from "./interfaces/IAsk.service";

export const askModule = new ContainerModule((bind) => {
  bind<IAskService>(TYPES.IAskService).to(AskService);
  bind<IAskRepository>(TYPES.IAskRepository).to(AskRepository);
});
