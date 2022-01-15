import { DrawingElement } from "../drawingElement/DrawingElementDataObject";
import { IVideoDrawingElement } from "./IVideoDrawingElement";

const VIDEO_ID_KEY = "videoId";
const VIDEO_DRAWING_ELEMENT_TYPE = "VideoDrawingElement";

export class VideoDrawingElement extends DrawingElement /*implements IVideoDrawingElement*/ {
  /**
   * initializingFirstTime is run only once by the first client to create the DataObject.  Here we use it to
   * initialize the state of the DataObject.
   */
  protected async initializingFirstTime() {
    await super.initializingFirstTime();
    this.root.set(DrawingElement.TYPE_KEY, VIDEO_DRAWING_ELEMENT_TYPE);
  }

  /**
   * hasInitialized is run by each client as they load the DataObject.  Here we use it to set up usage of the
   * DataObject, by registering an event listener for changes.
   */
  protected async hasInitialized() {}
}
