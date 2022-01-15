import { DataObject, DataObjectFactory } from "@fluidframework/aqueduct";
import { SharedMap, SharedObjectSequence } from "fluid-framework";
import { v4 as uuid } from "uuid";
import { LensBlob } from "../lensBlob/LensBlobDataObject";

const PAGE_ID_KEY = "pageId";
const WIDTH_KEY = "width";
const HEIGHT_KEY = "height";
const ROTATION_KEY = "rotation";
const OUTPUT_IMAGE_KEY = "outputImage";
const ASSOCIATED_ENTITIES_KEY = "associatedEntities";
const DRAWING_ELEMENT_IDS_LIST_KEY = "drawingElementIds";
const DRAWING_ELEMENTS_MAP_KEY = "drawingElementsMap";

export class PageElement extends DataObject {
  /**
   * initializingFirstTime is run only once by the first client to create the DataObject.  Here we use it to
   * initialize the state of the DataObject.
   */
  protected async initializingFirstTime() {
    this.root.set(PAGE_ID_KEY, uuid());
    this.root.set(WIDTH_KEY, 0);
    this.root.set(HEIGHT_KEY, 0);
    this.root.set(ROTATION_KEY, 0);
    this.root.set(
      ASSOCIATED_ENTITIES_KEY,
      SharedObjectSequence.create(this.runtime).handle
    );
    this.root.set(
      DRAWING_ELEMENT_IDS_LIST_KEY,
      SharedObjectSequence.create(this.runtime).handle
    );
    this.root.set(
      DRAWING_ELEMENTS_MAP_KEY,
      SharedMap.create(this.runtime).handle
    );
    this.root.set(
      OUTPUT_IMAGE_KEY,
      (await LensBlob.getFactory().createChildInstance(this.context)).handle
    );
  }
  /**
   * hasInitialized is run by each client as they load the DataObject.  Here we use it to set up usage of the
   * DataObject, by registering an event listener for changes.
   */
  protected async hasInitialized() {}

  public static get Name() {
    return "lens-hvc/page-element";
  }
  static getFactory() {
    return PageElement.factory;
  }

  private static readonly factory = new DataObjectFactory(
    PageElement.name,
    PageElement,
    [SharedObjectSequence.getFactory(), SharedMap.getFactory()],
    {},
    new Map([LensBlob.getFactory().registryEntry])
  );
}
