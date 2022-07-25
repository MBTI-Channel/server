import parser from "ua-parser-js";
// .getResult() 리턴 값 예시
// {
//   ua: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.0.0 Safari/537.36',
//   browser: { name: 'Chrome', version: '103.0.0.0', major: '103' },
//   engine: { name: 'Blink', version: '103.0.0.0' },
//   os: { name: 'Mac OS', version: '10.15.7' },
//   device: { vendor: undefined, model: undefined, type: undefined },
//   cpu: { architecture: undefined }
// }

const spaceReplace = (value: string[]) => {
  return value.map((e) => e.replace(/\s+/g, "-").toLowerCase());
};

/**
 * axios, postman 같은 경우 user-agent 길이가 짧아 그대로 반환
 * @returns `"사용자에이전트"` || `"브라우저이름-OS이름" || "unknown-bot"`
 */
export const convertUserAgent = (userAgent?: string) => {
  if (!userAgent) return `unknown-bot`;
  const result = new parser(userAgent).getResult();
  if (!result.browser.name || !result.os.name) return result.ua;

  const [browserName, osName] = spaceReplace([
    result.browser.name,
    result.os.name,
  ]);
  return `${browserName}-${osName}`;
};
