# inversify

## 정의

- DI를 구현하기 위한 IoC 컨테이너

## 사용목적

- 객체 간의 결합이 줄어들고 재사용성을 증가시키기 위해 사용

### scope 옵션 별 차이

A가 B ,C를 의존하고 B , C는 D를 의존하는 상황이라고 가정한다.

- `inTransientScope`

모든 종속성에 대해서 새로운 인스턴스를 만든다.
ex) `A.B.D !== A.C.D`, `A1.B !== A2.B`

- `inSingletonScope`

싱글톤 인스턴스가 전체 라이프 사이클동안 지속된다. `container.unbind`메서드를 사용해야 메모리상에서 지워진다.
ex) `A.B.D === A.C.D`, `A1.B === A2.B`

- `inRequestScope`

특별한 싱글톤 방식. container.get, container.getTagged 또는 container.getNamed 메소드에 한 번의 호출에 대해서 전체 라이프 사이클동안 지속되는 싱글톤 인스턴스를 만든다.
ex) `A.B.D === A.C.D`, `A1.B !== A2.B`

> 참고

- [Controlling the scope of the dependencies - InversifyJS](https://github.com/inversify/InversifyJS/blob/master/wiki/scope.md)
- [Request scope - InversifyJS/issues/1076](https://github.com/inversify/InversifyJS/issues/1076)
- [쉬어가는 페이지 - 스코프(Scope) - NestJS로 배우는 백엔드 프로그래밍 ](https://wikidocs.net/150160)
