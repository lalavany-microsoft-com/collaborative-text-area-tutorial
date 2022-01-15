import { DataObject, DataObjectFactory } from "@fluidframework/aqueduct";
import { v4 as uuid } from "uuid";
import { DOM } from "../DOM/DOMDataObject";
import { ROM } from "../ROM/ROMDataObject";
import { IDocumentModel } from "./IDocumentModel";

const DOCUMENT_ID_KEY = "documentId";
const DOM_KEY = "DOM";
const ROM_KEY = "ROM";

export class DocumentModel extends DataObject implements IDocumentModel {
  public readonly getDocumentId = (): string => {
    return this.root.get(DOCUMENT_ID_KEY) as string;
  };

  /**
   * initializingFirstTime is run only once by the first client to create the DataObject.  Here we use it to
   * initialize the state of the DataObject.
   */
  protected async initializingFirstTime() {
    this.root.set(DOCUMENT_ID_KEY, uuid());
    // add dom
    const dom = await DOM.getFactory().createChildInstance(this.context);
    this.root.set(DOM_KEY, dom.handle);
    // add rom
    const rom = await ROM.getFactory().createChildInstance(this.context);
    this.root.set(ROM_KEY, rom.handle);
  }

  public static get Name() {
    return "lens-hvc/document-model";
  }
  public static getFactory() {
    return DocumentModel.factory;
  }
  private static readonly factory = new DataObjectFactory(
    DocumentModel.name,
    DocumentModel,
    [],
    {},
    new Map([DOM.getFactory().registryEntry, ROM.getFactory().registryEntry])
  );
}
