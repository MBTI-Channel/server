import { Ask } from "../../../modules/ask/entity/ask.entity";

export interface IApiWebhookService {
  /**
   * 새 문의 등록 알림
   */
  pushAskNotification(askEntity: Ask): Promise<void>;
  /**
   * 서버 에러 발생 알림
   */
  pushErrorNotification(err: Error): Promise<void>;
}
