import { DataObject, DataObjectFactory } from "@fluidframework/aqueduct";
import { SharedMap } from "fluid-framework";
import { DocumentProperties } from "../documentProperties/DocumentPropertiesDataObject";

const DOCUMENT_PROPERTIES_KEY = "documentProperties";
const ENTITY_MAP_KEY = "entityMap";

export class DOM extends DataObject /*implements IDOM*/ {
  /**
   * initializingFirstTime is run only once by the first client to create the DataObject.  Here we use it to
   * initialize the state of the DataObject.
   */
  protected async initializingFirstTime() {
    const docProps = await DocumentProperties.getFactory().createChildInstance(
      this.context
    );
    this.root.set(DOCUMENT_PROPERTIES_KEY, docProps.handle);
    const entityMap = SharedMap.create(this.runtime);
    this.root.set(ENTITY_MAP_KEY, entityMap.handle);
  }
  /**
   * hasInitialized is run by each client as they load the DataObject.  Here we use it to set up usage of the
   * DataObject, by registering an event listener for changes.
   */
  protected async hasInitialized() {}

  public static get Name() {
    return "lens-hvc/dom";
  }
  static getFactory() {
    return DOM.factory;
  }

  private static readonly factory = new DataObjectFactory(
    DOM.name,
    DOM,
    [SharedMap.getFactory()],
    {},
    new Map([DocumentProperties.getFactory().registryEntry])
  );
}
