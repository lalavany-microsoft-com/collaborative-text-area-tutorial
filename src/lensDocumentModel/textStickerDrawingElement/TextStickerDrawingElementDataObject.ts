import { DataObject, DataObjectFactory } from "@fluidframework/aqueduct";
import { SharedString } from "fluid-framework";
import { DrawingElement } from "../drawingElement/DrawingElementDataObject";
import {
  ITextStickerDrawingElement,
  ITextStickerStyle,
  TextStyleId,
} from "./ITextStickerDrawingElement";

const TEXT_KEY = "text";
const TEXT_STICKER_STYLE_KEY = "textStickerStyle";
const TEXT_STICKER_DRAWING_ELEMENT_TYPE = "TextStickerDrawingElement";

export class ImageStickerDrawingElement extends DrawingElement /*implements ITextStickerDrawingElement*/ {
  /**
   * initializingFirstTime is run only once by the first client to create the DataObject.  Here we use it to
   * initialize the state of the DataObject.
   */
  protected async initializingFirstTime() {
    await super.initializingFirstTime();
    this.root.set(DrawingElement.TYPE_KEY, TEXT_STICKER_DRAWING_ELEMENT_TYPE);
    this.root.set(TEXT_KEY, SharedString.create(this.runtime).handle);
    this.root.set(
      TEXT_STICKER_STYLE_KEY,
      (await TextStickerStyle.getFactory().createChildInstance(this.context))
        .handle
    );
  }

  /**
   * hasInitialized is run by each client as they load the DataObject.  Here we use it to set up usage of the
   * DataObject, by registering an event listener for changes.
   */
  protected async hasInitialized() {}
}

const BASE_STYLE_ID_KEY = "baseStyleId";
const FONT_NAME_KEY = "fontName";
const FONT_SIZE_KEY = "fontSize";
const THEME_ID_KEY = "themeId";
const TEXT_COLOR_KEY = "textColor";
const BACKGROUND_COLOR_KEY = "backgroundColor";
const CORNER_RADIUS_KEY = "cornerRadius";
const BORDER_WIDTH_KEY = "borderWidth";
const BORDER_COLOR_KEY = "borderColor";
const BACKGROUND_ALPHA_KEY = "backgroundAlpha";

export class TextStickerStyle extends DataObject /*implements ITextStickerStyle*/ {
  /**
   * initializingFirstTime is run only once by the first client to create the DataObject.  Here we use it to
   * initialize the state of the DataObject.
   */
  protected async initializingFirstTime() {
    this.root.set(BASE_STYLE_ID_KEY, TextStyleId.none);
  }

  /**
   * hasInitialized is run by each client as they load the DataObject.  Here we use it to set up usage of the
   * DataObject, by registering an event listener for changes.
   */
  protected async hasInitialized() {}

  public static get Name() {
    return "lens-hvc/text-sticker-style";
  }
  static getFactory() {
    return TextStickerStyle.factory;
  }

  private static readonly factory = new DataObjectFactory(
    TextStickerStyle.name,
    TextStickerStyle,
    [],
    {}
  );
}
