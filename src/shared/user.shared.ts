import { interfaces } from "inversify-express-utils";
import { User } from "../modules/user/entity/user.entity";

export class Principal implements interfaces.Principal {
  public details: User;

  public constructor(details: User) {
    this.details = details;
  }
  /**
   * @deprecated The method should not be used
   */
  public isAuthenticated(): Promise<boolean> {
    return Promise.resolve(true);
  }
  /**
   * @deprecated The method should not be used
   */
  public isResourceOwner(resourceId: unknown): Promise<boolean> {
    return Promise.resolve(true);
  }
  /**
   * @deprecated The method should not be used
   */
  public isInRole(role: string): Promise<boolean> {
    return Promise.resolve(true);
  }
}
