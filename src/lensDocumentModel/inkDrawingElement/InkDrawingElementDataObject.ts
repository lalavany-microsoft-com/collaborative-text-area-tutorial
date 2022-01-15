import { SharedObjectSequence, SharedSequence } from "fluid-framework";
import { DrawingElement } from "../drawingElement/DrawingElementDataObject";
import { IInkDrawingElement } from "./IInkDrawingElement";

const STROKES_KEY = "strokes";
const INK_DRAWING_ELEMENT_TYPE = "InkDrawingElement";

export class ImageStickerDrawingElement extends DrawingElement /*implements IInkDrawingElement*/ {
  /**
   * initializingFirstTime is run only once by the first client to create the DataObject.  Here we use it to
   * initialize the state of the DataObject.
   */
  protected async initializingFirstTime() {
    await super.initializingFirstTime();
    this.root.set(DrawingElement.TYPE_KEY, INK_DRAWING_ELEMENT_TYPE);
    this.root.set(
      STROKES_KEY,
      SharedObjectSequence.create(this.runtime).handle
    );
  }

  /**
   * hasInitialized is run by each client as they load the DataObject.  Here we use it to set up usage of the
   * DataObject, by registering an event listener for changes.
   */
  protected async hasInitialized() {}
}
