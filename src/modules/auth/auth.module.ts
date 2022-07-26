import { ContainerModule } from "inversify";
import { TYPES } from "../../core/type.core";
import { AuthService } from "./auth.service";
import { IAuthService } from "./interfaces/IAuth.service";

export const authModule = new ContainerModule((bind) => {
  bind<IAuthService>(TYPES.IAuthService).to(AuthService);
});
