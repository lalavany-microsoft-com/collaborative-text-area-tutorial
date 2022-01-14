import { IDrawingElement } from "../drawingElement/IDrawingElement";
import { Point } from "../Point";

export interface IInkDrawingElement extends IDrawingElement {
  strokes: Stroke[];
}

export interface Stroke {
  color: string;
  points: Point[];
  width: number;
}
