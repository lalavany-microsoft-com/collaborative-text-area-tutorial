import { DataObject, DataObjectFactory } from "@fluidframework/aqueduct";
import { IMyImage } from "./IMyImage";
import { IFluidHandle } from "@fluidframework/core-interfaces";

export class MyData extends DataObject implements IMyImage {
  public async getBlob() {
    const dataPromise = this.root.get("image") as IFluidHandle<ArrayBufferLike>;
    if (dataPromise) {
      const data = await dataPromise.get();
      return new Blob([new Uint8Array(data)]);
    } else {
      return Promise.resolve(undefined);
    }
  }

  public setBlob(blob: Blob | undefined) {
    if (blob) {
      new Response(new Blob(["lalavany"]))
        .arrayBuffer()
        .then((arrayBufferLike) => {
          return this.runtime.uploadBlob(arrayBufferLike);
        })
        .then((fluidHandle) => {
          this.root.set("image", fluidHandle);
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
