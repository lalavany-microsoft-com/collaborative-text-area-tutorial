import { DataObject, DataObjectFactory } from "@fluidframework/aqueduct";
import { ILensBlob } from "./ILensBlob";

const BLOB_KEY = "pageId";

export class LensBlob extends DataObject implements ILensBlob {
  public async getBlob() {
    const base64 = this.root.get(BLOB_KEY);
    if (base64) {
      return await (await fetch(base64)).blob();
    } else {
      return Promise.resolve(undefined);
    }
  }

  blobToBase64(blob: Blob) {
    return new Promise((resolve, _) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.readAsDataURL(blob);
    });
  }

  public setBlob(blob: Blob | undefined) {
    if (blob) {
      this.blobToBase64(blob).then((base64) => {
        this.root.set(BLOB_KEY, base64);
      });
    } else {
      this.root.set(BLOB_KEY, blob);
    }
  }

  /**
   * hasInitialized is run by each client as they load the DataObject.  Here we use it to set up usage of the
   * DataObject, by registering an event listener for changes.
   */
  protected async hasInitialized() {
    this.root.on("valueChanged", (changed) => {
      // When we see the contacts change, we'll emit the contactCollectionChanged event we specified
      // in our interface.
      this.emit("contentChanged");
    });
  }

  public static get Name() {
    return "lens-hvc/lens-blob";
  }
  static getFactory() {
    return LensBlob.factory;
  }

  private static readonly factory = new DataObjectFactory(
    LensBlob.name,
    LensBlob,
    [],
    {}
  );
}
