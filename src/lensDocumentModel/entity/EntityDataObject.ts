import { DataObject, DataObjectFactory } from "@fluidframework/aqueduct";
import { v4 as uuid } from "uuid";
import { IEntity } from "./IEntity";

export class Entity extends DataObject /*implements IEntity*/ {
  static IDENTITY_KEY = "identity";
  static ENTITY_ID_KEY = "entityId";
  static TYPE_KEY = "type";
  /**
   * initializingFirstTime is run only once by the first client to create the DataObject.  Here we use it to
   * initialize the state of the DataObject.
   */
  protected async initializingFirstTime() {
    this.root.set(Entity.ENTITY_ID_KEY, uuid());
    this.root.set(Entity.IDENTITY_KEY, "");
  }

  /**
   * hasInitialized is run by each client as they load the DataObject.  Here we use it to set up usage of the
   * DataObject, by registering an event listener for changes.
   */
  protected async hasInitialized() {}

  public static get Name() {
    return "lens-hvc/entity";
  }
  static getFactory() {
    return Entity.factory;
  }

  private static readonly factory = new DataObjectFactory(
    Entity.name,
    Entity,
    [],
    {}
  );
}
