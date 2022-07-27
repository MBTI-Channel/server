import { ContainerModule } from "inversify";
import { TYPES } from "../../core/types.core";
import { DiscordApiService } from "./discord-api.service";
import { IApiAccountService } from "./interfaces/IApi-account.service";
import { IApiWebhookService } from "./interfaces/IApi-webhook.service";
import { KakaoApiService } from "./kakao-api.service";
import { NaverApiService } from "./naver-api.service";

export const apiModule = new ContainerModule((bind) => {
  bind<IApiAccountService>(TYPES.NaverApiService).to(NaverApiService);
  bind<IApiAccountService>(TYPES.KakaoApiService).to(KakaoApiService);
  bind<IApiWebhookService>(TYPES.IApiWebhookService).to(DiscordApiService);
});
