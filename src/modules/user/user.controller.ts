import { Request, Response } from "express";
import { inject } from "inversify";
import {
  BaseHttpController,
  controller,
  httpGet,
  httpPost,
  queryParam,
  requestBody,
} from "inversify-express-utils";
import { TYPES } from "../../core/type.core";
import {
  bodyValidator,
  queryValidator,
} from "../../middlewares/validator.middleware";
import { IUserService } from "./interfaces/IUser.service";
import { User } from "./entity/user.entity";
import { OauthLoginDto } from "../auth/dto/oauth-login.dto";
import { SignUpDto, NicknameDuplicateCheckDto } from "./dto";
import config from "../../config";

@controller("/users")
export class UserController extends BaseHttpController {
  @inject(TYPES.IUserService) private readonly _userService: IUserService;

  // 회원가입 (nickname, mbti 설정)
  @httpPost("/", bodyValidator(SignUpDto))
  async signUp(@requestBody() body: SignUpDto, req: Request, res: Response) {
    const { id, uuid, nickname, mbti } = body;
    const data = await this._userService.signUp(id, uuid, nickname, mbti);
    return res.status(201).json(data);
  }

  // 닉네임 중복확인
  @httpGet("/", queryValidator(NicknameDuplicateCheckDto))
  async nicknameDuplicateCheck(
    @queryParam() dto: NicknameDuplicateCheckDto,
    req: Request,
    res: Response
  ) {
    const { nickname } = dto;
    const result = await this._userService.isExistsNickname(nickname);
    return res.status(200).json({ isExistsNickname: result });
  }

  // 유저 로그인
  @httpPost(
    "/login",
    bodyValidator(OauthLoginDto),
    TYPES.GetProviderUserByOauthMiddleware,
    TYPES.SocialSignUpMiddleware
  )
  async oauthLogin(req: Request, res: Response) {
    const { id, providerId } = req.user as User;
    const data = await this._userService.login(id, providerId);

    res.cookie("Refresh", data.refreshToken, {
      httpOnly: true,
      secure: false, // true
      maxAge: config.cookie.refreshTokenMaxAge,
    });

    return res.status(201).json(data);
  }

  // access token 재발급
  @httpGet("/accessToken", TYPES.ValidateReissueTokenMiddleware)
  async reissueAccessToken(req: Request, res: Response) {
    const accessToken = req.headers!.authorization!.replace("Bearer ", "");

    const data = await this._userService.reissueAccessToken(accessToken);
    return res.status(200).json({
      data,
    });
  }

  //사용자 유효한지 지속적으로 확인
  @httpGet("/me", TYPES.ValidateAccessTokenMiddleware)
  async validateUser(req: Request, res: Response) {
    const { nickname, mbti, isAdmin } = req.user as User;

    return res.status(200).json({
      nickname,
      mbti,
      isAdmin,
    });
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
