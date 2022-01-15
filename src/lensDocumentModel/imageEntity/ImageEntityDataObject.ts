import { DataObject, DataObjectFactory } from "@fluidframework/aqueduct";
import { SharedObjectSequence, SharedString } from "fluid-framework";
import { LensWorkflowType } from "../documentModel/IDocumentModel";
import { Entity } from "../entity/EntityDataObject";
import { LensBlob } from "../lensBlob/LensBlobDataObject";
import {
  CropData,
  IImageEntity,
  ImageSource,
  IProcessedImageInfo,
  LensFilter,
  OriginalImageInfo,
} from "./IImageEntity";

const IMAGE_ENTITY_TYPE = "ImageEntity";
const ASSOCIATED_ENTITIES_KEY = "associatedEntites";
const CAPTION_KEY = "caption";
const ORIGINAL_IMAGE_INFO_KEY = "originalImageInfo";
const PROCESSED_IMAGE_INFO_KEY = "processedImageInfo";

export class ImageEntity extends Entity /*implements IImageEntity*/ {
  /**
   * initializingFirstTime is run only once by the first client to create the DataObject.  Here we use it to
   * initialize the state of the DataObject.
   */
  protected async initializingFirstTime() {
    await super.initializingFirstTime();
    this.root.set(Entity.TYPE_KEY, IMAGE_ENTITY_TYPE);
    this.root.set(
      ASSOCIATED_ENTITIES_KEY,
      SharedObjectSequence.create(this.runtime).handle
    );
    this.root.set(CAPTION_KEY, SharedString.create(this.runtime).handle);
    const originalImageInfo = {
      originalImage: (
        await LensBlob.getFactory().createChildInstance(this.context)
      ).handle,
      rotation: 0,
      width: 0,
      height: 0,
      source: ImageSource.unknown,
      createdTime: 0,
      exifData: {},
    };
    this.root.set(ORIGINAL_IMAGE_INFO_KEY, originalImageInfo);
    this.root.set(
      PROCESSED_IMAGE_INFO_KEY,
      (await ProcessedImageInfo.getFactory().createChildInstance(this.context))
        .handle
    );
  }
}

const WORKFLOW_TYPE_KEY = "workflowType";
const FILTER_KEY = "filter";
const PROCESSED_IMAGE_KEY = "processedImage";
const CROP_DATA_KEY = "cropData";

export class ProcessedImageInfo extends DataObject /*implements IProcessedImageInfo*/ {
  /**
   * initializingFirstTime is run only once by the first client to create the DataObject.  Here we use it to
   * initialize the state of the DataObject.
   */
  protected async initializingFirstTime() {
    this.root.set(WORKFLOW_TYPE_KEY, LensWorkflowType.photo);
    this.root.set(FILTER_KEY, LensFilter.none);
    this.root.set(
      PROCESSED_IMAGE_KEY,
      LensBlob.getFactory().createChildInstance(this.context)
    );
    const defCropData: CropData = {
      croppingQuad: {
        topLeft: { x: 0, y: 0 },
        topRight: { x: 1, y: 0 },
        bottomRight: { x: 1, y: 1 },
        bottomLeft: { x: 0, y: 1 },
      },
      rectifiedQuadWidth: 1,
      rectifiedQuadHeight: 1,
    };
    this.root.set(CROP_DATA_KEY, defCropData);
  }

  /**
   * hasInitialized is run by each client as they load the DataObject.  Here we use it to set up usage of the
   * DataObject, by registering an event listener for changes.
   */
  protected async hasInitialized() {}

  public static get Name() {
    return "lens-hvc/processed-image-info";
  }
  static getFactory() {
    return ProcessedImageInfo.factory;
  }

  private static readonly factory = new DataObjectFactory(
    ProcessedImageInfo.name,
    ProcessedImageInfo,
    [],
    {}
  );
}
