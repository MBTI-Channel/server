import axios from "axios";
import { inject, injectable } from "inversify";
import { TYPES } from "../../core/type.core";
import { Ask } from "../../modules/ask/entity/ask.entity";
import { Logger } from "../utils/logger.util";
import { IApiWebhookService } from "./interfaces/IApi-webhook.service";
import config from "../../config";

/**
 * https://discord.com/developers/docs/resources/webhook#execute-webhook
 */

const { discord } = config;
const DARK_RED = 10038562;
const GREEN = 5763719;

@injectable()
export class DiscordApiService implements IApiWebhookService {
  private _askChannel = discord.askWebhookUrl;
  private _errorChannel = discord.errorWebhookUrl;

  constructor(@inject(TYPES.Logger) private readonly _logger: Logger) {}

  async pushAskNotification(askEntity: Ask): Promise<void> {
    //if (process.env.NODE_ENV === "development") return;
    const { email, title, content, createdAt, imageUrl } = askEntity;
    await axios({
      url: this._askChannel,
      method: "POST",
      headers: { "Content-Type": "application/json" },
      data: {
        embeds: [
          {
            title: `새로운 문의가 등록되었습니다.`,
            color: GREEN,
            fields: [
              {
                name: "Email",
                value: email,
                inline: true,
              },
              {
                name: "datetime",
                value: createdAt,
                inline: true,
              },
              {
                name: "title",
                value: title,
              },
            ],
            image: {
              url: imageUrl ?? null,
            },
            footer: {
              text: content,
            },
          },
        ],
      },
    }).catch((e) => this._logger.error(e));
  }

  async pushErrorNotification(err: Error): Promise<void> {
    if (process.env.NODE_ENV === "development") return;
    await axios({
      url: this._errorChannel,
      method: "POST",
      headers: { "Content-Type": "application/json" },
      data: {
        embeds: [
          {
            title: `${err.name}`,
            color: DARK_RED,
            fields: [
              {
                name: "message",
                value: err.message,
              },
              {
                name: "datetime",
                value: new Date().toString(),
              },
            ],
            footer: {
              text: err.stack,
            },
          },
        ],
      },
    }).catch((e) => this._logger.error(e));
  }
}
