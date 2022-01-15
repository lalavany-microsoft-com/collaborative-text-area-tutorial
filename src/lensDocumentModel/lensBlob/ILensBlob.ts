import { EventEmitter } from "stream";

export interface ILensBlob extends EventEmitter {
  getBlob: () => Promise<Blob | undefined>;

  setBlob: (blob: Blob | undefined) => void;

  on(event: "contentChanged", listener: () => void): this;
}
