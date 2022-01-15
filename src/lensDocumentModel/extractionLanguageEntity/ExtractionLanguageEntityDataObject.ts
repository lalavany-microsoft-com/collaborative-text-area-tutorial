import { Entity } from "../entity/EntityDataObject";
import {
  IExtractionLanguageEntity,
  LensLanguage,
} from "./IExtractionLanguageEntity";

const EXTRACTION_LANGUAGE_ENTITY_TYPE = "ExtractionLanguageEntity";
const EXTRACTION_LANGUAGE_KEY = "extractionLanguage";
export class ExtractionLanguageEntity extends Entity /*implements IExtractionLanguageEntity*/ {
  /**
   * initializingFirstTime is run only once by the first client to create the DataObject.  Here we use it to
   * initialize the state of the DataObject.
   */
  protected async initializingFirstTime() {
    await super.initializingFirstTime();
    this.root.set(Entity.TYPE_KEY, EXTRACTION_LANGUAGE_ENTITY_TYPE);
    this.root.set(EXTRACTION_LANGUAGE_KEY, LensLanguage.english);
  }
}
