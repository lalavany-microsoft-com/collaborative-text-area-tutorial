import { IDrawingElement } from "../drawingElement/IDrawingElement";

export interface ITextStickerDrawingElement extends IDrawingElement {
  text: string;
  stickerStyle: ITextStickerStyle;
}

export interface ITextStickerStyle {
  baseStyleId: string; // enum
  fontName?: string;
  fontSize?: string;
  themeId?: number; // enum
  textColor?: string;
  backgroundColor?: string;
  backgroundAlpha?: number;
  cornerRadius?: number;
  borderWidth?: number;
  borderColor?: string;
}
