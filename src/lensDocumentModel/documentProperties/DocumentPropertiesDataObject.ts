import { DataObject, DataObjectFactory } from "@fluidframework/aqueduct";
import {
  IDirectoryValueChanged,
  SharedMap,
  SharedString,
} from "fluid-framework";
import {
  IDocumentProperties,
  ImageCompression,
  ImageDPI,
} from "../documentProperties/IDocumentProperties";
import { IFluidHandle } from "@fluidframework/core-interfaces";
import { SharedStringHelper } from "@fluid-experimental/react-inputs";

const DOCUMENT_TITLE_KEY = "documentTitle";
const IMAGE_COMPRESSION_KEY = "imageCompression";
const IMAGE_DPI_KEY = "imageDPI";
export class DocumentProperties
  extends DataObject
  implements IDocumentProperties
{
  private sharedStringHelper: SharedStringHelper | undefined;
  public readonly getSharedDocumentTitle = (): string | undefined => {
    return this.sharedStringHelper?.getText();
  };

  public readonly getImageCompression = (): ImageCompression => {
    return this.root.get(IMAGE_COMPRESSION_KEY) as ImageCompression;
  };
  public readonly setImageCompression = (
    imageCompression: ImageCompression
  ) => {
    this.root.set(IMAGE_COMPRESSION_KEY, imageCompression);
  };
  public readonly getImageDPI = (): ImageDPI => {
    return this.root.get(IMAGE_DPI_KEY) as ImageDPI;
  };
  public readonly setImageDPI = (imageDPI: ImageDPI) => {
    this.root.set(IMAGE_DPI_KEY, imageDPI);
  };

  /**
   * initializingFirstTime is run only once by the first client to create the DataObject.  Here we use it to
   * initialize the state of the DataObject.
   */
  protected async initializingFirstTime() {
    const sharedString = SharedString.create(this.runtime);
    this.root.set(DOCUMENT_TITLE_KEY, sharedString.handle);
    this.root.set(IMAGE_COMPRESSION_KEY, ImageCompression.medium);
    this.root.set(IMAGE_DPI_KEY, ImageDPI.original);
  }

  /**
   * hasInitialized is run by each client as they load the DataObject.  Here we use it to set up usage of the
   * DataObject, by registering an event listener for changes.
   */
  protected async hasInitialized() {
    this.root.on("valueChanged", this.valueChangedListener);
    const sharedDocTitle = await (
      this.root.get(DOCUMENT_TITLE_KEY) as IFluidHandle<SharedString>
    ).get();
    this.sharedStringHelper = new SharedStringHelper(sharedDocTitle);
    this.sharedStringHelper.on("textChanged", this.textChangeListener);
  }

  public dispose() {
    this.root.off("valueChanged", this.valueChangedListener);
    this.sharedStringHelper?.off("textChanged", this.textChangeListener);
  }

  private valueChangedListener = (changed: IDirectoryValueChanged) => {
    if (changed.key === IMAGE_COMPRESSION_KEY) {
      this.emit("imageCompressionChanged");
    } else if (changed.key === IMAGE_DPI_KEY) {
      this.emit("imageDPIChanged");
    }
  };

  private textChangeListener = () => {
    this.emit("documentTitleChanged");
  };

  public static get Name() {
    return "lens-hvc/document-properties";
  }
  public static getFactory() {
    return DocumentProperties.factory;
  }
  private static readonly factory = new DataObjectFactory(
    DocumentProperties.name,
    DocumentProperties,
    [SharedMap.getFactory(), SharedString.getFactory()],
    {}
  );
}
