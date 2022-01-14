import { EventEmitter } from "stream";

export interface IMyImage extends EventEmitter {
  getBlob: () => Promise<Blob | undefined>;

  setBlob: (blob: Blob | undefined) => void;

  /**
   * The contactCollectionChanged event will fire whenever the list changes, either locally or remotely.
   */
  on(event: "imageChanged", listener: () => void): this;
}
