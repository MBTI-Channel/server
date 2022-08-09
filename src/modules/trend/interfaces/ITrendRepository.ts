import { GetAllTrendDto } from "../dto/get-all-trend.dto";
import { Trend } from "../entity/trend.entity";

export interface ITrendRepository {
  createTrend(trendEntity: Trend): Promise<Trend>;
  findAllTrends(pageOptionsDto: GetAllTrendDto): Promise<any>; // TODO: 반환 타입 변경
}
