import {
  PageInfiniteScrollInfoDto,
  PageResponseDto,
} from "../../../shared/page";
import { GetAllTrendDto } from "../dto/get-all-trend.dto";
import { TrendResponseDto } from "../dto/trend-response.dto";

export interface ITrendService {
  createTrend(targetId: number): Promise<void>;
  getTrends(
    pageOptionsDto: GetAllTrendDto
  ): Promise<PageResponseDto<PageInfiniteScrollInfoDto, TrendResponseDto>>;
}
