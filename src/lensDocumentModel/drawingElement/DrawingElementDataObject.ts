import { DataObject, DataObjectFactory } from "@fluidframework/aqueduct";
import { v4 as uuid } from "uuid";
import { Transformation } from "./IDrawingElement";

export class DrawingElement extends DataObject /*implements IDrawingElement*/ {
  static ID_KEY = "id";
  static TYPE_KEY = "type";
  static WIDTH_KEY = "width";
  static HEIGHT_KEY = "height";
  static TRANSFORMATION_KEY = "transformation";

  /**
   * initializingFirstTime is run only once by the first client to create the DataObject.  Here we use it to
   * initialize the state of the DataObject.
   */
  protected async initializingFirstTime() {
    this.root.set(DrawingElement.ID_KEY, uuid());
    this.root.set(DrawingElement.WIDTH_KEY, 0);
    this.root.set(DrawingElement.HEIGHT_KEY, 0);
    const defTransformation: Transformation = {
      rotation: 0,
      translationX: 0,
      translationY: 0,
      scaleX: 1,
      scaleY: 1,
    };
    this.root.set(DrawingElement.TRANSFORMATION_KEY, defTransformation);
  }

  /**
   * hasInitialized is run by each client as they load the DataObject.  Here we use it to set up usage of the
   * DataObject, by registering an event listener for changes.
   */
  protected async hasInitialized() {}

  public static get Name() {
    return "lens-hvc/drawing-element";
  }
  static getFactory() {
    return DrawingElement.factory;
  }

  private static readonly factory = new DataObjectFactory(
    DrawingElement.name,
    DrawingElement,
    [],
    {}
  );
}
