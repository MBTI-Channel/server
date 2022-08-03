# class-validator

## 정의

- 데코레이터를 이용해서 편리하게 오브젝트의 프로퍼티를 검증할 수 있는 라이브러리이다.

## 사용 목적

- 웹 서버에서 들어오는 HTTP 요청의 JSON body 검증할 때 사용한다.
- `class-transformer`와 `class-validator`를 이용해서 라우터나 컨트롤러에 도달하기 전에 요청의 JSON body를 클래스의 인스턴스로 변환한 뒤에 검증할 수 있다

![](https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2FbEpqfe%2FbtrtaiZLfKS%2F0lKeLmKjusj8G4ekF8iJs1%2Fimg.png)

## 예시

```
  @IsString()
  @IsNotEmpty()
  @Length(2, 10)
  @Matches(/^[|가-힣|a-z|A-Z|0-9|]{2,10}$/)
  nickname: string;
```

> 참고

- [class-validator의 활용과 검증 옵션](https://seungtaek-overflow.tistory.com/13)
