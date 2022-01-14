import { DataObject, DataObjectFactory } from "@fluidframework/aqueduct";
import { IMyImage } from "./IMyImage";

export class MyData extends DataObject implements IMyImage {
  public async getBlob() {
    const base64 = this.root.get("image");
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
        this.root.set("image", base64);
      });
    } else {
      this.root.set("image", blob);
    }
  }

  /**
   * hasInitialized is run by each client as they load the DataObject.  Here we use it to set up usage of the
   * DataObject, by registering an event listener for changes to the contact list.
   */
  protected async hasInitialized() {
    this.root.on("valueChanged", (changed) => {
      // When we see the contacts change, we'll emit the contactCollectionChanged event we specified
      // in our interface.
      this.emit("imageChanged");
    });
  }
}
/**
 * The DataObjectFactory is used by Fluid Framework to instantiate our DataObject.  We provide it with a unique name
 * and the constructor it will call.  In this scenario, the third and fourth arguments are not used.
 */
export const MyDataInstantiationFactory = new DataObjectFactory(
  "my-data",
  MyData,
  [],
  {}
);
