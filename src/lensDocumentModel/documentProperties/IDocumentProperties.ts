import { EventEmitter } from "events";
export interface IDocumentProperties extends EventEmitter {
  getSharedDocumentTitle: () => string | undefined;
  getImageCompression: () => ImageCompression;
  setImageCompression: (imageCompression: ImageCompression) => void;
  getImageDPI: () => ImageDPI;
  setImageDPI: (imageDPI: ImageDPI) => void;

  on(event: "imageCompressionChanged", listener: () => void): this;
  on(event: "imageDPIChanged", listener: () => void): this;
  on(event: "documentTitleChanged", listener: () => void): this;
}

export enum ImageCompression {
  none = 1,
  veryLow = 0.95,
  low = 0.85,
  medium = 0.75,
  high = 0.6,
  veryHigh = 0.5,
  vVeryHigh = 0.4,
  vVVeryHigh = 0.3,
  vVVVeryHigh = 0.25,
  vVVVVeryHigh = 0.2,
  vVVVVVeryHigh = 0.1,
}

export enum ImageDPI {
  original,
  low = 150,
  medium = 220,
  high = 300,
}
