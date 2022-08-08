import { ContainerModule } from "inversify";
import { TYPES } from "../../core/types.core";
import { ITrendService } from "./interfaces/ITrend.service";
import { ITrendRepository } from "./interfaces/ITrendRepository";
import { TrendRepository } from "./trend.repository";
import { TrendService } from "./trend.service";

export const trendModule = new ContainerModule((bind) => {
  bind<ITrendService>(TYPES.ITrendService).to(TrendService);
  bind<ITrendRepository>(TYPES.ITrendRepository).to(TrendRepository);
});
