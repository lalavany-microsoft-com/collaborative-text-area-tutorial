import { DrawingElement } from "../drawingElement/DrawingElementDataObject";
import { IImageStickerDrawingElement } from "./IImageStickerDrawingElement";

const ASSET_ID_KEY = "assetId";
const IMAGE_STICKER_DRAWING_ELEMENT_TYPE = "ImageStickerDrawingElement";

export class ImageStickerDrawingElement extends DrawingElement /*implements IImageStickerDrawingElement*/ {
  /**
   * initializingFirstTime is run only once by the first client to create the DataObject.  Here we use it to
   * initialize the state of the DataObject.
   */
  protected async initializingFirstTime() {
    await super.initializingFirstTime();
    this.root.set(DrawingElement.TYPE_KEY, IMAGE_STICKER_DRAWING_ELEMENT_TYPE);
  }

  /**
   * hasInitialized is run by each client as they load the DataObject.  Here we use it to set up usage of the
   * DataObject, by registering an event listener for changes.
   */
  protected async hasInitialized() {}
}
