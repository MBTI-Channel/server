import { interfaces } from "inversify";
import container from "../src/core/container.core";
import { TYPES } from "../src/core/types.core";
import { mockDataBaseService } from "./mock-database.service";
import { mockLogger } from "./mock-logger";

export class TestContainer {
  private _container = container;

  /**
   * 1. 각 단위 테스트가 다른 단위 테스트를 중단하지 않고 수정할 수 있도록 스냅샷 생성
   * 2. mockLogger 리바인드
   */
  init() {
    this._container.snapshot();
    this._container.rebind(TYPES.Logger).toConstantValue(mockLogger);
    this._container
      .rebind(TYPES.IDatabaseService)
      .toConstantValue(mockDataBaseService);
  }
  /**
   * 각 단위 테스트가 애플리케이션 컨테이너의 새 복사본을 가져오도록 마지막 스냅샷으로 복원
   */
  restore() {
    this._container.restore();
  }

  /**
   * `mockingImplementation`은 `Partial<T> = { [P in keyof T]?: T[P] | undefined; }`를 참고하여 작성함
   * @param serviceIdentifier 컨테이너 식별자 `string | symbol `
   * @param mockingInterface 모킹할 인터페이스의 구현체
   */
  mock<T>(
    serviceIdentifier: interfaces.ServiceIdentifier<T>,
    mockingInterface: { [method in keyof T]?: () => any }
  ) {
    this._container
      .rebind(serviceIdentifier)
      .toConstantValue(mockingInterface as T);
    return jest.fn(() => mockingInterface)() as T;
  }

  get<T>(serviceIdentifier: interfaces.ServiceIdentifier<T>): T {
    return this._container.get<T>(serviceIdentifier);
  }
}
