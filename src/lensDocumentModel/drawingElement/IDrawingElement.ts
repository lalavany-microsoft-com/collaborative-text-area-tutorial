export interface IDrawingElement {
  type: string;
  id: string; // uuid
  width: number;
  height: number;
  transformation: Transformation;
}

export interface Transformation {
  rotation: number;
  translationX: number;
  translationY: number;
  scaleX: number;
  scaleY: number;
}
