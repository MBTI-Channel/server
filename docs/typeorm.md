# typeorm

## 정의

- Node.js에서 실행할 수 있는 `ORM`이며 TypeScript 및 JavaScript와 함께 사용할 수 있다.
- 많은 데이터 베이스를 지원하며 다른 자바스크립트 ORM들과 달리 `Active Record`, `Data Mapper` 두 패턴을 지원한다.

## 사용 목적

- to always support the latest JavaScript features and provide additional features that help you to develop any kind of application that uses databases - from small applications with a few tables to large scale enterprise applications with multiple databases.

## 특징

### Data Mapper 지원

TypeORM은 [Data Mapper](https://en.wikipedia.org/wiki/Data_mapper_pattern) 패턴을 지원하기 때문에 다음 이점을 얻는다.

- 데이터베이스에 접근하기 위해 모델이 아닌 'repository'를 통해 접근해야한다. 따라서 Entity 클래스가 데이터 베이스에 대해 이해할 필요가 없는, 즉 의존성이 없어지므로 결합도가 낮아진다.
- ORM, RDBMS에 종속적이지 않으므로 확장성에 장점이 있다.

  > 참고
  > [what is the data mapper pattern - typeorm](https://typeorm.io/active-record-data-mapper#what-is-the-data-mapper-pattern) > [NestJS & TypeORM 환경에서 Monorepo 구성하기 - jojoldu.tistory.com](https://jojoldu.tistory.com/597)

### QueryBuilder

> QueryBuilder는 TypeORM의 가장 강력한 기능 중 하나입니다. 우아하고 편리한 구문을 사용하여 SQL 쿼리를 작성하고 실행하고 자동으로 변환된 엔터티를 가져올 수 있습니다.
> [waht is querybuilder - typeorm](https://typeorm.io/select-query-builder#what-is-querybuilder)

- `Repository API`만으로는 부족한 부분을 `QueryBuilder`를 사용하면 편리하게 SQL 쿼리문을 실행할 수 있다.
