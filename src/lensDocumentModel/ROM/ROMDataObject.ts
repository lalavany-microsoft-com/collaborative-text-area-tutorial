import { DataObject, DataObjectFactory } from "@fluidframework/aqueduct";
import { SharedMap, SharedObjectSequence } from "fluid-framework";

// SharedObjectSequence does not support reorder as of now
const PAGEID_LIST_KEY = "pageIdsList";
const PAGES_MAP = "pagesMap";
export class ROM extends DataObject /*implements IROM*/ {
  /**
   * initializingFirstTime is run only once by the first client to create the DataObject.  Here we use it to
   * initialize the state of the DataObject.
   */
  protected async initializingFirstTime() {
    const pageIdsList = SharedObjectSequence.create(this.runtime);
    this.root.set(PAGEID_LIST_KEY, pageIdsList.handle);
    const pagesMap = SharedMap.create(this.runtime);
    this.root.set(PAGES_MAP, pagesMap.handle);
  }
  /**
   * hasInitialized is run by each client as they load the DataObject.  Here we use it to set up usage of the
   * DataObject, by registering an event listener for changes.
   */
  protected async hasInitialized() {}

  private static readonly factory = new DataObjectFactory(
    ROM.name,
    ROM,
    [SharedMap.getFactory(), SharedObjectSequence.getFactory()],
    {}
  );
  static getFactory() {
    return ROM.factory;
  }
  public static get Name() {
    return "lens-hvc/ROM";
  }
}
