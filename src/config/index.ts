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
    clientId: process.env.NAVER_CLIENT_ID!,
    clientSecret: process.env.NAVER_CLIENT_SECRET!,
    redirectUri: process.env.NAVER_REDIRECT_URI!,
    randomState: process.env.NAVER_RANDOM_STATE!,
  },
};
