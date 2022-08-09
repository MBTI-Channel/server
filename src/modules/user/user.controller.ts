import { Request, Response } from "express";
import { inject } from "inversify";
import {
  controller,
  httpGet,
  httpPatch,
  httpPost,
  queryParam,
  requestBody,
} from "inversify-express-utils";
import { TYPES } from "../../core/types.core";
import {
  bodyValidator,
  queryValidator,
} from "../../middlewares/validator.middleware";
import { IUserService } from "./interfaces/IUser.service";
import { ILoginLogService } from "../login-log/interfaces/ILogin-log.service";
import { IPostService } from "../post/interfaces/IPost.service";
import { ICommentService } from "../comment/interfaces/IComment.service";
import { User } from "./entity/user.entity";
import { OauthLoginDto } from "../auth/dto/oauth-login.dto";
import { GetAllByUserDto } from "../comment/dto";
import { SignUpDto, CheckDuplicateNicknameDto, UpdateUserDto } from "./dto";
import { convertUserAgent } from "../../shared/utils/user-agent.util";
import { GetMyPostsDto } from "../post/dto";
import config from "../../config";

@controller("/users")
export class UserController {
  constructor(
    @inject(TYPES.IUserService) private readonly _userService: IUserService,
    @inject(TYPES.ILoginLogService)
    private readonly _loginLogService: ILoginLogService,
    @inject(TYPES.IPostService)
    private readonly _postSerivce: IPostService,
    @inject(TYPES.ICommentService)
    private readonly _commentService: ICommentService
  ) {}

  // 회원가입 (nickname, mbti 설정)
  @httpPost("/", bodyValidator(SignUpDto))
  public async signUp(
    @requestBody() body: SignUpDto,
    req: Request,
    res: Response
  ) {
    const { id, uuid, nickname, mbti } = body;
    const userAgent = convertUserAgent(req.headers["user-agent"]);
    const data = await this._userService.signUp(
      id,
      uuid,
      nickname,
      mbti,
      userAgent
    );
    return res.status(201).json(data);
  }

  // 닉네임 중복확인
  @httpGet("/check", queryValidator(CheckDuplicateNicknameDto))
  public async checkDuplicateNickname(
    @queryParam() dto: CheckDuplicateNicknameDto,
    req: Request,
    res: Response
  ) {
    const { nickname } = dto;
    await this._userService.checkDuplicateNickname(nickname);
    return res.status(200).json({ message: "available nickname" });
  }

  // 유저 로그인
  @httpPost(
    "/login",
    bodyValidator(OauthLoginDto),
    TYPES.GetProviderUserByOauthMiddleware,
    TYPES.SocialSignUpMiddleware
  )
  public async oauthLogin(req: Request, res: Response) {
    const user = req.user as User;
    const userAgent = convertUserAgent(req.headers["user-agent"]);
    const data = await this._userService.login(
      user.id,
      user.providerId,
      userAgent
    );

    res.cookie("Refresh", data.refreshToken, {
      httpOnly: true,
      secure: false, // true
      maxAge: config.cookie.refreshTokenMaxAge,
    });

    const ip = req.ip;
    await this._loginLogService.record(user, userAgent, ip);
    return res.status(201).json(data);
  }

  // access token 재발급
  @httpGet("/accessToken", TYPES.ValidateReissueTokenMiddleware)
  public async reissueAccessToken(req: Request, res: Response) {
    const user = req.user as User;
    const refreshToken = req.cookies.Refresh;
    const userAgent = convertUserAgent(req.headers["user-agent"]);

    const data = await this._userService.reissueAccessToken(
      user,
      refreshToken,
      userAgent
    );

    return res.status(200).json(data);
  }

  //사용자 유효한지 지속적으로 확인
  @httpGet("/me", TYPES.ValidateAccessTokenMiddleware)
  public async validateUser(req: Request, res: Response) {
    const data = req.user as User;

    return res.status(200).json(data);
  }

  @httpPatch(
    "/me",
    TYPES.ValidateAccessTokenMiddleware,
    bodyValidator(UpdateUserDto)
  )
  public async updateUser(
    @requestBody() body: UpdateUserDto,
    req: Request,
    res: Response
  ) {
    const user = req.user as User;
    const { nickname, mbti } = body;

    const data = await this._userService.update(user, nickname, mbti);

    return res.status(200).json(data);
  }

  // 내가 작성한 게시글 조회
  @httpGet(
    "/posts",
    TYPES.ValidateAccessTokenMiddleware,
    queryValidator(GetMyPostsDto)
  )
  public async getMyPosts(
    @queryParam() query: GetMyPostsDto,
    req: Request,
    res: Response
  ) {
    const user = req.user as User;
    const data = await this._postSerivce.getMyPosts(user, query); //TODO: postService.getUserPosts로
    return res.status(200).json(data);
  }

  // 내가 댓글단 글 조회
  @httpGet(
    "/comments",
    TYPES.ValidateAccessTokenMiddleware,
    queryValidator(GetAllByUserDto)
  )
  async getMyComments(
    @queryParam() query: GetAllByUserDto,
    req: Request,
    res: Response
  ) {
    const user = req.user as User;
    const data = await this._commentService.getAllByUser(user, query);
    return res.status(200).json(data);
  }

  // 임시 kakao 라우터
  @httpGet("/kakao")
  async kakaoLogin(req: Request, res: Response) {
    const url = `https://kauth.kakao.com/oauth/authorize?client_id=${config.kakao.restApiKey}&redirect_uri=${config.kakao.redirectUri}&response_type=code`;
    return res.redirect(url);
  }

  // 임시 naver 라우터
  @httpGet("/naver")
  async naverLogin(req: Request, res: Response) {
    const url = `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${config.naver.clientId}&redirect_uri=${config.naver.redirectUri}&state=${config.naver.randomState}`;
    return res.redirect(url);
  }

  // 임시 리다이렉트 라우터
  @httpGet("/redirect")
  async getAuthCode(req: Request, res: Response) {
    return res.status(200).json({ code: req.query.code });
  }
}
