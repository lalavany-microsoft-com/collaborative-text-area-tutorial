import { IDrawingElement } from "../drawingElement/IDrawingElement";

export interface ITextStickerDrawingElement extends IDrawingElement {
  text: string;
  stickerStyle: ITextStickerStyle;
}

export interface ITextStickerStyle {
  baseStyleId: TextStyleId; // enum
  fontName?: string;
  fontSize?: string;
  themeId?: TextStyleThemeId; // enum
  textColor?: string;
  backgroundColor?: string;
  backgroundAlpha?: number;
  cornerRadius?: number;
  borderWidth?: number;
  borderColor?: string;
}

export enum TextStyleId {
  none,
  regular,
  watermark,
  strong,
  highlight,
}

export enum TextStyleThemeId {
  red,
  blue,
  black,
  white,
  yellow,
  green,
  none,
}
