## 개발환경 도커 실행하기

준비물 : Docker

1. server repository clone
   [mbti-channel server 리포지토리](https://github.com/MBTI-Channel/server)를 로컬에 clone하기

```
git clone https://github.com/MBTI-Channel/server.git
```

2. clone해온 server 디렉토리에서, 의존성 설치

```
npm install
```

3. server디렉토리 내에 env 디렉토리 만든후, `.development.env` 생성
4. `.development.env` 작성 (백엔드 노션 참고)
5. server 디렉토리에서 다음 명령어 실행

```
docker-compose --file docker-compose.dev.yml up --build
```
