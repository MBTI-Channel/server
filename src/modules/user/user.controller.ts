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
import { OauthLoginDto } from "../auth/dtos/oauth-login.dto";
import { LoginDto, SignUpDto, NicknameDuplicateCheckDto } from "./dto";
import config from "../../config";

@controller("/users")
export class UserController extends BaseHttpController {
  @inject(TYPES.IUserService) private readonly userService: IUserService;

  // 회원가입 (nickname, mbti 설정)
  @httpPost("/", bodyValidator(SignUpDto))
  async signUp(@requestBody() body: SignUpDto, req: Request, res: Response) {
    const { user, accessToken, refreshToken } = await this.userService.signUp(
      body
    );

    return res.status(201).json({
      nickname: user.nickname,
      mbti: user.mbti,
      isAdmin: user.isAdmin,
      accessToken,
      refreshToken,
    });
  }

  // 닉네임 중복확인
  @httpGet("/", queryValidator(NicknameDuplicateCheckDto))
  async nicknameDuplicateCheck(
    @queryParam() dto: NicknameDuplicateCheckDto,
    req: Request,
    res: Response
  ) {
    const result = await this.userService.isExistsNickname(dto);
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
    const dto = req.user as LoginDto;
    const { user, accessToken, refreshToken } = await this.userService.login(
      dto
    );
    res.cookie("Refresh", refreshToken, {
      httpOnly: true,
      secure: false, // true
      maxAge: config.cookie.refreshTokenMaxAge,
    });

    return res.status(201).json({
      nickname: user.nickname,
      mbti: user.mbti,
      isAdmin: user.isAdmin,
      accessToken,
      refreshToken,
    });
  }

  // access token 재발급
  @httpGet("/accessToken", TYPES.ValidateReissueTokenMiddleware)
  async reissueAccessToken(req: Request, res: Response) {
    const accessToken = req.headers!.authorization!.replace("Bearer ", "");

    const { newAccessToken } = await this.userService.reissueAccessToken(
      accessToken
    );
    return res.status(200).json({
      newAccessToken,
    });
  }

  //사용자 유효한지 지속적으로 확인
  @httpGet("/auth", TYPES.ValidateAccessTokenMiddleware)
  async validateUser(req: Request, res: Response) {
    // TODO: access token payload의 id가 db에 존재하는지, db의 mbti, nickname과 일치하는지

    return res.status(200).json({
      message: "access token valid",
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
