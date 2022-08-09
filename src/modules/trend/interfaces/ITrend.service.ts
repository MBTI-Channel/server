import { GetAllTrendDto } from "../dto/get-all-trend.dto";
import { Trend } from "../entity/trend.entity";

export interface ITrendService {
  createTrend(targetId: number): Promise<void>;
  getTrends(pageOptionsDto: GetAllTrendDto): Promise<any>; // TODO: 반환 타입 변경
}
