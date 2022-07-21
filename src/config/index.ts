import "dotenv/config";

process.env.NODE_ENV = process.env.NODE_ENV || "development";

const isValidEnvVar = (key: string, defaultValue: any = undefined) => {
  const value = process.env[key] || defaultValue;
  if (value === null) {
    throw new Error(`invalid environment variable : ${key}`);
  }
  return value;
};

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
    accessTokenExpiresIn: isValidEnvVar("JWT_ACCESS_EXPIRES"),
    refreshTokenExpiresIn: isValidEnvVar("JWT_REFRESH_EXPIRES"),
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
    redisUserName: isValidEnvVar("REDIS_USERNAME"),
    redisPassword: isValidEnvVar("REDIS_PASSWORD"),
    redisHost: isValidEnvVar("REDIS_HOST"),
    redisPort: isValidEnvVar("REDIS_PORT"),
  },
  discord: {
    askWebhookUrl: isValidEnvVar("DISCORD_ASK_WEBHOOK_URL"),
    errorWebhookUrl: isValidEnvVar("DISCORD_ERROR_WEBHOOK_URL"),
  },
};
