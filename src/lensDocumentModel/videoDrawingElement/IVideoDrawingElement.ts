import { IDrawingElement } from "../drawingElement/IDrawingElement";

export interface IVideoDrawingElement extends IDrawingElement {
  videoId: string;
}
