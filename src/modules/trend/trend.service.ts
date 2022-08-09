import { inject, injectable } from "inversify";
import { TYPES } from "../../core/types.core";
import { PageInfiniteScrollInfoDto, PageResponseDto } from "../../shared/page";
import { Logger } from "../../shared/utils/logger.util";
import { IPostRepository } from "../post/interfaces/IPost.repository";
import { GetAllTrendDto } from "./dto/get-all-trend.dto";
import { TrendResponseDto } from "./dto/trend-response.dto";
import { Trend } from "./entity/trend.entity";
import { ITrendService } from "./interfaces/ITrend.service";
import { ITrendRepository } from "./interfaces/ITrendRepository";

@injectable()
export class TrendService implements ITrendService {
  constructor(
    @inject(TYPES.Logger) private readonly _logger: Logger,
    @inject(TYPES.ITrendRepository)
    private readonly _trendRepository: ITrendRepository,
    @inject(TYPES.IPostRepository)
    private readonly _postRepository: IPostRepository
  ) {}

  private _log(message: string) {
    this._logger.trace(`[TrendService] ${message}`);
  }

  public async createTrend(targetId: number): Promise<void> {
    this._log("createTrend start");

    const trendEntity = Trend.of(targetId);

    const trend = await this._trendRepository.createTrend(trendEntity);

    // TODO: targetUser 에게 알림 보내기
  }

  public async getTrends(
    pageOptionsDto: GetAllTrendDto
  ): Promise<PageResponseDto<PageInfiniteScrollInfoDto, TrendResponseDto>> {
    this._log("getTrends start");

    let trendArray;
    trendArray = await this._trendRepository.findAllTrends(pageOptionsDto);
    console.log(trendArray);
    let nextId = null;
    if (trendArray.length === pageOptionsDto.maxResults + 1) {
      nextId = trendArray[trendArray.length - 1].id;
      trendArray.pop();
    }
    let itemsPerPage = trendArray.length;

    const pageInfoDto = new PageInfiniteScrollInfoDto(0, itemsPerPage, nextId);

    // TODO: 인기글에 등록이 되었는데, 게시글을 삭제했을 경우 처리
    return new PageResponseDto(
      pageInfoDto,
      trendArray.map((e) => new TrendResponseDto(e, e.post))
    );
  }
}
