import { LensWorkflowType } from "../documentModel/IDocumentModel";
import { IEntity } from "../entity/IEntity";
import { Point } from "../Point";

export interface IImageEntity extends IEntity {
  associatedEntities: IEntity[];
  caption: string;
  originalImageInfo: OriginalImageInfo;
  processedImageInfo: IProcessedImageInfo;
}

export interface OriginalImageInfo {
  originalImage: Blob;
  rotation: number;
  width: number;
  height: number;
  source: ImageSource;
  createdTime: number;
  exifData: any;
  baseQuad?: CroppingQuad;
}

export interface IProcessedImageInfo {
  workflowType: LensWorkflowType;
  filter: LensFilter;
  processedImage?: Blob;
  cropData?: CropData;
}

export enum ImageSource {
  camera,
  customGallery,
  nativeGallery,
  externalGallery,
  external,
  oneDrive,
  unknown,
}

export enum LensFilter {
  none,
  process,
  sepia,
  chrome,
  mono,
  transfer,
  instant,
  noir,
  tonal,
  fade,
  sauvolaColor,
  document,
  sauvolaScored,
  whiteboard,
  sbcAdjust,
  blackAndWhite,
  grayscale,
  dark,
  platformDoc,
  notebook,
}

export interface CroppingQuad {
  topLeft: Point;
  topRight: Point;
  bottomRight: Point;
  bottomLeft: Point;
}

export interface CropData {
  croppingQuad: CroppingQuad;
  rectifiedQuadWidth: number;
  rectifiedQuadHeight: number;
}
