import { inject, injectable } from "inversify";
import { TYPES } from "../../core/types.core";
import { IApiWebhookService } from "../../shared/api/interfaces/IApi-webhook.service";
import { Logger } from "../../shared/utils/logger.util";
import { User } from "../user/entity/user.entity";
import { AskResponseDto } from "./dto/ask-response.dto";
import { Ask } from "./entity/ask.entity";
import { IAskRepository } from "./interfaces/IAsk.repository";
import { IAskService } from "./interfaces/IAsk.service";

@injectable()
export class AskService implements IAskService {
  constructor(
    @inject(TYPES.Logger) private readonly _logger: Logger,
    @inject(TYPES.IApiWebhookService)
    private readonly _discordService: IApiWebhookService,
    @inject(TYPES.IAskRepository)
    private readonly _askRepository: IAskRepository
  ) {}

  private _log(message: string) {
    this._logger.trace(`[AskService] ${message}`);
  }

  public async create(
    user: User,
    title: string,
    content: string,
    imageUrl: string,
    email: string
  ): Promise<AskResponseDto> {
    this._log("create start");
    const askEntity = Ask.of(user, title, content, email, imageUrl);

    const createdAsk = await this._askRepository.create(askEntity);
    this._discordService.pushAskNotification(askEntity);

    return new AskResponseDto(createdAsk, user);
  }
}
