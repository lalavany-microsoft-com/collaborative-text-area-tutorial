import { IEntity } from "../entity/IEntity";

export interface IVideoEntity extends IEntity {
  associatedEntities: IEntity[];
  caption: string;
  originalVideoInfo: OriginalVideoInfo;
  processedVideoInfo: IProcessedVideoInfo;
}

export interface OriginalVideoInfo {
  originalVideo: Blob;
  source: VideoSource;
  createdTime: number;
  clipData: ClipData[];
}

export interface IProcessedVideoInfo {
  clipData: IProcessedClipData[];
  processedVideo?: Blob;
}

export interface TrimData {
  startDuration: number;
  endDuration: number;
}

export interface IProcessedClipData {
  trimData: TrimData;
  processedClipVideo: Blob;
}

export interface ClipData {
  duration: number;
  video: Blob;
}

export enum VideoSource {
  camera,
  customGallery,
  nativeGallery,
  externalGallery,
  external,
  oneDrive,
  unknown,
}
