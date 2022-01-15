import { SharedString } from "fluid-framework";
import { Entity } from "../entity/EntityDataObject";
import { IExtractedEntity } from "./IExtractedEntity";

const EXTRACTED_ENTITY_TYPE = "ExtractedEntity";
const EXTRACTED_CONTENT_KEY = "extractedContent";
export class ExtractedEntity extends Entity /*implements IExtractedEntity*/ {
  /**
   * initializingFirstTime is run only once by the first client to create the DataObject.  Here we use it to
   * initialize the state of the DataObject.
   */
  protected async initializingFirstTime() {
    await super.initializingFirstTime();
    this.root.set(Entity.TYPE_KEY, EXTRACTED_ENTITY_TYPE);
    this.root.set(
      EXTRACTED_CONTENT_KEY,
      SharedString.create(this.runtime).handle
    );
  }
}
