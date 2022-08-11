import { User } from "../../user/entity/user.entity";
import { SurveyResponseDto } from "../dto";

export interface ISurveyService {
  create(
    user: User,
    postId: number,
    agree: boolean
  ): Promise<SurveyResponseDto>;
}
