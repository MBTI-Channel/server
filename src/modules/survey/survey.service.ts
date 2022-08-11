import { inject, injectable } from "inversify";
import { TYPES } from "../../core/types.core";
import { PostType } from "../../shared/enum.shared";
import {
  BadReqeustException,
  NotFoundException,
} from "../../shared/errors/all.exception";
import { Logger } from "../../shared/utils/logger.util";
import { IPostRepository } from "../post/interfaces/IPost.repository";
import { User } from "../user/entity/user.entity";
import { SurveyResponseDto } from "./dto";
import { Survey } from "./entity/survey.entity";
import { ISurveyRepository } from "./interfaces/ISurvey.repository";
import { ISurveyService } from "./interfaces/ISurvey.service";

@injectable()
export class SurveyService implements ISurveyService {
  constructor(
    @inject(TYPES.Logger) private readonly _logger: Logger,
    @inject(TYPES.IPostRepository)
    private readonly _postRepository: IPostRepository,
    @inject(TYPES.ISurveyRepository)
    private readonly _surveyRepository: ISurveyRepository
  ) {}

  private _log(message: string) {
    this._logger.trace(`[SurveyService] ${message}`);
  }

  public async create(
    user: User,
    postId: number,
    isAgree: boolean
  ): Promise<SurveyResponseDto> {
    this._log(`create start`);

    // 존재하는 게시글인지 확인
    const post = await this._postRepository.findOneById(postId);
    if (!post || !post.isActive) throw new NotFoundException(`not exists post`);
    // 게시글 타입이 survey인지 확인
    if (post.type !== PostType.SURVEY)
      throw new BadReqeustException(`post type should survey`);

    // 이미 참여한 survey인지 확인
    let survey = await this._surveyRepository.findOneByUser(user.id, postId);

    // 참여하지 않은 survey인 경우
    if (!survey) {
      const surveyEntity = Survey.of(post, user, isAgree);
      survey = await this._surveyRepository.create(surveyEntity);
    } else {
      const previousVote = survey.isAgree;
      if (previousVote === isAgree) {
        // 기존의 투표 취소
        // TODO: survey isActive === false ??
      } else {
        // 기존의 투표에서 변경
        survey = await this._surveyRepository.update(survey.id, {
          isAgree,
        });
      }
    }
    return new SurveyResponseDto(survey, post, user);
  }
}
