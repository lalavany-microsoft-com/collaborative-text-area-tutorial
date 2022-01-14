import { IDrawingElement } from "../drawingElement/IDrawingElement";
import { IEntity } from "../entity/IEntity";

export interface IPageElement {
  pageId: string;
  width: number;
  height: number;
  rotation: number;
  drawingElements: IDrawingElement[];
  associatedEntities: IEntity[];
  outputImage?: Blob;
}
