import { ContainerModule } from "inversify";
import { TYPES } from "../../core/type.core";
import { JwtUtil } from "./jwt.util";
import { Logger } from "./logger.util";

export const utilModule = new ContainerModule((bind) => {
  bind<Logger>(TYPES.Logger).to(Logger);
  bind<JwtUtil>(TYPES.JwtUtil).to(JwtUtil);
});
