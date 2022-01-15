import { DataObject, DataObjectFactory } from "@fluidframework/aqueduct";
import { SharedObjectSequence, SharedString } from "fluid-framework";
import { Entity } from "../entity/EntityDataObject";
import { LensBlob } from "../lensBlob/LensBlobDataObject";
import {
  ClipData,
  IVideoEntity,
  VideoSource,
  IProcessedVideoInfo,
  IProcessedClipData,
  OriginalVideoInfo,
} from "./IVideoEntity";

const VIDEO_ENTITY_TYPE = "VideoEntity";
const ASSOCIATED_ENTITIES_KEY = "associatedEntites";
const CAPTION_KEY = "caption";
const ORIGINAL_VIDEO_INFO_KEY = "originalVideoInfo";
const PROCESSED_VIDEO_INFO_KEY = "processedVideoInfo";

export class VideoEntity extends Entity /*implements IVideoEntity*/ {
  /**
   * initializingFirstTime is run only once by the first client to create the DataObject.  Here we use it to
   * initialize the state of the DataObject.
   */
  protected async initializingFirstTime() {
    await super.initializingFirstTime();
    this.root.set(Entity.TYPE_KEY, VIDEO_ENTITY_TYPE);
    this.root.set(
      ASSOCIATED_ENTITIES_KEY,
      SharedObjectSequence.create(this.runtime).handle
    );
    this.root.set(CAPTION_KEY, SharedString.create(this.runtime).handle);
    const originalVideoInfo = {
      originalVideo: (
        await LensBlob.getFactory().createChildInstance(this.context)
      ).handle,
      source: VideoSource.unknown,
      createdTime: 0,
      clipData: [],
    };
    this.root.set(ORIGINAL_VIDEO_INFO_KEY, originalVideoInfo);
    this.root.set(
      PROCESSED_VIDEO_INFO_KEY,
      (await ProcessedVideoInfo.getFactory().createChildInstance(this.context))
        .handle
    );
  }
}

const PROCESSED_VIDEO_KEY = "processedVideo";
const CLIP_DATA_KEY = "clipData";

export class ProcessedVideoInfo extends DataObject /*implements IProcessedVideoInfo*/ {
  /**
   * initializingFirstTime is run only once by the first client to create the DataObject.  Here we use it to
   * initialize the state of the DataObject.
   */
  protected async initializingFirstTime() {
    this.root.set(
      PROCESSED_VIDEO_KEY,
      LensBlob.getFactory().createChildInstance(this.context)
    );
    this.root.set(CLIP_DATA_KEY, SharedObjectSequence.create(this.runtime));
  }

  /**
   * hasInitialized is run by each client as they load the DataObject.  Here we use it to set up usage of the
   * DataObject, by registering an event listener for changes.
   */
  protected async hasInitialized() {}

  public static get Name() {
    return "lens-hvc/processed-video-info";
  }
  static getFactory() {
    return ProcessedVideoInfo.factory;
  }

  private static readonly factory = new DataObjectFactory(
    ProcessedVideoInfo.name,
    ProcessedVideoInfo,
    [],
    {}
  );
}

const PROCESSED_CLIP_DATA_KEY = "processedClipData";
const START_DURATION_KEY = "startDuration";
const END_DURATION_KEY = "endDuration";

export class ProcessedClipData extends DataObject /*implements IProcessedClipData*/ {
  /**
   * initializingFirstTime is run only once by the first client to create the DataObject.  Here we use it to
   * initialize the state of the DataObject.
   */
  protected async initializingFirstTime() {
    this.root.set(
      PROCESSED_CLIP_DATA_KEY,
      LensBlob.getFactory().createChildInstance(this.context)
    );
    this.root.set(START_DURATION_KEY, 0);
    this.root.set(END_DURATION_KEY, 0);
  }

  /**
   * hasInitialized is run by each client as they load the DataObject.  Here we use it to set up usage of the
   * DataObject, by registering an event listener for changes.
   */
  protected async hasInitialized() {}

  public static get Name() {
    return "lens-hvc/processed-clip-data";
  }
  static getFactory() {
    return ProcessedClipData.factory;
  }

  private static readonly factory = new DataObjectFactory(
    ProcessedClipData.name,
    ProcessedClipData,
    [],
    {}
  );
}
