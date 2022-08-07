import dotenv from "dotenv";
import path from "path";

const ENV_ROOT = "./env/";

dotenv.config({
  path: path.resolve(
    process.env.NODE_ENV === "production"
      ? ENV_ROOT + ".production.env"
      : process.env.NODE_ENV === "stage"
      ? ENV_ROOT + ".stage.env"
      : ENV_ROOT + ".development.env"
  ),
});

const isValidEnvVar = (key: string, defaultValue: any = undefined) => {
  const value = process.env[key] || defaultValue;
  if (value === null) {
    throw new Error(`invalid environment variable : ${key}`);
  }
  return value;
};

// const timeCalculate = (expires: string) => {
//   const time = expires
//     .split("*")
//     .reduce((total: number, value: string) => (total *= parseInt(value)), 1);

//   return time;
// };

export default {
  port: isValidEnvVar("PORT", 8000),
  mysql: {
    host: isValidEnvVar("MYSQL_HOST"),
    port: parseInt(isValidEnvVar("MYSQL_PORT")),
    username: isValidEnvVar("MYSQL_USER"),
    password: isValidEnvVar("MYSQL_PASSWORD"),
    database: isValidEnvVar("MYSQL_DB"),
  },
  kakao: {
    restApiKey: isValidEnvVar("KAKAO_REST_API_KEY"),
    redirectUri: isValidEnvVar("KAKAO_REDIRECT_URI"),
  },
  naver: {
    clientId: isValidEnvVar("NAVER_CLIENT_ID"),
    clientSecret: isValidEnvVar("NAVER_CLIENT_SECRET"),
    redirectUri: isValidEnvVar("NAVER_REDIRECT_URI"),
    randomState: isValidEnvVar("NAVER_RANDOM_STATE"),
  },
  jwt: {
    secret: isValidEnvVar("JWT_SECRET"),
    accessTokenExpiresIn: parseInt(isValidEnvVar("JWT_ACCESS_EXPIRES")),
    refreshTokenExpiresIn: parseInt(isValidEnvVar("JWT_REFRESH_EXPIRES")),
    issuer: isValidEnvVar("JWT_ISSUER"),
  },
  cookie: {
    refreshTokenMaxAge: parseInt(isValidEnvVar("COOKIE_REFRESH_MAX_AGE")),
  },
  user: {
    status: {
      withdrawal: parseInt(isValidEnvVar("USER_STATUS_WITHDRAWAL")),
      new: parseInt(isValidEnvVar("USER_STATUS_NEW")),
      normal: parseInt(isValidEnvVar("USER_STATUS_NORMAL")),
      restriction: parseInt(isValidEnvVar("USER_STATUS_RESTRICTION")),
    },
  },
  redis: {
    url: isValidEnvVar("REDIS_URL"),
  },
  discord: {
    askWebhookUrl: isValidEnvVar("DISCORD_ASK_WEBHOOK_URL"),
    errorWebhookUrl: isValidEnvVar("DISCORD_ERROR_WEBHOOK_URL"),
  },
  aws: {
    s3AccessKey: isValidEnvVar("S3_ACCESS_KEY"),
    s3SecretKey: isValidEnvVar("S3_SECRET_KEY"),
    bucketName: isValidEnvVar("BUCKET_NAME"),
    region: isValidEnvVar("REGION"),
  },
};
