import { TinyliciousClient } from "@fluidframework/tinylicious-client";
import {
  ContainerSchema,
  IFluidContainer,
  SharedMap,
  SharedObjectSequence,
  SharedString,
} from "fluid-framework";

export const loadSharedDocumentModel = async () => {
  // Configure the container.
  const client: TinyliciousClient = new TinyliciousClient();
  const containerSchema: ContainerSchema = {
    initialObjects: {
      pageList:
        SharedObjectSequence /* need to change it to SharedSequence once its ready */,
      pageMap: SharedMap,
      entityMap: SharedMap,
      documentProperties: SharedMap,
      drawingElementsMap: SharedMap,
    },
    dynamicObjectTypes: [SharedObjectSequence, SharedMap, SharedString],
  };

  // Get the container from the Fluid service.
  let container: IFluidContainer;
  const containerId = window.location.hash.substring(1);
  if (!containerId) {
    container = (await client.createContainer(containerSchema)).container;

    // populate document properties
    const { initialObjects } = container;
    const documentProperties = initialObjects.documentProperties as SharedMap;
    documentProperties.set("documentTitle", "SampleDocTitle");
    documentProperties.set("imageDPI", 0.5);
    documentProperties.set("imageCompression", 0.8);

    const id = await container.attach();
    window.location.hash = id;
  } else {
    container = (await client.getContainer(containerId, containerSchema))
      .container;
    if (!container.connected) {
      await new Promise<void>((resolve) => {
        container.once("connected", () => {
          resolve();
        });
      });
    }
  }

  // Return the Fluid container shared objects.
  return container;
};

export const addSampleImageEntity = async (container: IFluidContainer) => {
  // create ImageEntity
  const imageEntity = await container.create(SharedMap);

  imageEntity.set("entityID", "sampleEntityId");
  imageEntity.set("type", "ImageEntity");
  imageEntity.set("identity", "");

  imageEntity.set("state", "created");

  const associatedEntities = await container.create(SharedObjectSequence);
  imageEntity.set("associatedEntities", associatedEntities.handle);

  const originalImageInfo: OriginalImageInfo = {
    imagePath: "sampleImagePath",
    rotation: 0,
    sourceImageUri: "sampleSourceImageUri",
    width: 0,
    height: 0,
    source: "camera",
    createdTime: "05-01-2022 19:00UTC",
    exifData: {},
    baseQuad: {
      topLeft: { x: 0, y: 0 },
      topRight: { x: 1, y: 0 },
      bottomRight: { x: 1, y: 1 },
      bottomLeft: { x: 0, y: 1 },
    },
  };
  imageEntity.set("originalImageInfo", originalImageInfo);

  const processedImageInfo = await container.create(SharedMap);
  processedImageInfo.set("workflowType", "Scan");
  processedImageInfo.set("filter", 3);
  processedImageInfo.set("pathHolder", {
    path: "sampleProcessedImagePath",
    isPathOwner: true,
  });
  const cropData: CropData = {
    croppingQuad: {
      topLeft: { x: 0, y: 0 },
      topRight: { x: 1, y: 0 },
      bottomRight: { x: 1, y: 1 },
      bottomLeft: { x: 0, y: 1 },
    },
    rectifiedQuadWidth: 1,
    rectifiedQuadHeight: 1,
  };
  processedImageInfo.set("cropData", cropData);
  imageEntity.set("processedImageInfo", processedImageInfo.handle);

  const caption = await container.create(SharedString);
  imageEntity.set("caption", caption.handle);

  // add ImageEntity to entityMap
  const entityMap = container.initialObjects.entityMap as SharedMap;
  entityMap.set(imageEntity.get("entityId") as string, imageEntity.handle);

  // create new PageElement with ImageDrawingElement
  const pageElement = await container.create(SharedMap);
  pageElement.set("pageId", "samplePageID");
  pageElement.set("width", 100);
  pageElement.set("height", 100);
  pageElement.set("rotation", 0);

  const pageAssociatedEntities = await container.create(SharedObjectSequence);
  pageElement.set("associatedEntities", pageAssociatedEntities.handle);

  pageElement.set("outputPathHolder", {
    path: "sampleOutputImagePath",
    isPathOwner: true,
  });

  const drawingElements = await container.create(SharedObjectSequence);

  // create new image drawing element
  const imageDrawingElement = await container.create(SharedMap);
  imageDrawingElement.set("type", "ImageDrawingElement");
  imageDrawingElement.set("id", "sampleImageDrawingElementId");
  imageDrawingElement.set("width", 100);
  imageDrawingElement.set("height", 100);
  const transformation: Transformation = {
    rotation: 0,
    translationX: 0,
    translationY: 0,
    scaleX: 1,
    scaleY: 1,
  };
  imageDrawingElement.set("transformation", transformation);
  imageDrawingElement.set("imageId", imageEntity.get("entityId") as string);

  // add imageDrawingElement to drawingElementsMap
  const drawingElementsMap = container.initialObjects
    .drawingElementsMap as SharedMap;
  drawingElementsMap.set(
    imageEntity.get("entityId") as string,
    imageDrawingElement.handle
  );

  // add image drawing element id
  drawingElements.insert(0, [imageDrawingElement.get("id") as string]);

  pageElement.set("drawingElements", drawingElements.handle);

  // add page element to pageMap
  const pageMap = container.initialObjects.pageMap as SharedMap;
  pageMap.set(pageElement.get("pageId") as string, pageElement.handle);

  // add page id to pageList
  const pageList = container.initialObjects
    .pageList as SharedObjectSequence<string>;
  pageList.insert(pageList.getLength(), [pageElement.get("pageId") as string]);
};

export const addInkDrawingElement = async (
  container: IFluidContainer,
  pageId: string,
  inkDrawingElement: InkDrawingElement
) => {
  const sharedInkDrawingElement = await container.create(SharedMap);
  sharedInkDrawingElement.set("type", "InkDrawingElement");
  sharedInkDrawingElement.set("id", inkDrawingElement.id);
  sharedInkDrawingElement.set("width", inkDrawingElement.width);
  sharedInkDrawingElement.set("height", inkDrawingElement.height);
  sharedInkDrawingElement.set(
    "transformation",
    inkDrawingElement.transformation
  );

  const strokes = await container.create(SharedObjectSequence);
  strokes.insert(0, inkDrawingElement.strokes);
  sharedInkDrawingElement.set("strokes", strokes.handle);

  // add sharedInkDrawingElement to drawingElementsMap
  const drawingElementsMap = container.initialObjects
    .drawingElementsMap as SharedMap;
  drawingElementsMap.set(
    sharedInkDrawingElement.get("id") as string,
    sharedInkDrawingElement.handle
  );

  // add sharedInkDrawingElement id to page's drawing elements
  const page = (container.initialObjects.pageMap as SharedMap).get(
    pageId
  ) as SharedMap;
  const drawingElements = page.get(
    "drawingElements"
  ) as SharedObjectSequence<string>;
  drawingElements.insert(drawingElements.getLength(), [
    sharedInkDrawingElement.get("id") as string,
  ]);
};

export const addTextStickerDrawingElement = async (
  container: IFluidContainer,
  pageId: string,
  textStickerDrawingElement: TextStickerDrawingElement
) => {
  const sharedTextStickerDrawingElement = await container.create(SharedMap);
  sharedTextStickerDrawingElement.set("type", "TextStickerDrawingElement");
  sharedTextStickerDrawingElement.set("id", textStickerDrawingElement.id);
  sharedTextStickerDrawingElement.set("width", textStickerDrawingElement.width);
  sharedTextStickerDrawingElement.set(
    "height",
    textStickerDrawingElement.height
  );
  sharedTextStickerDrawingElement.set(
    "transformation",
    textStickerDrawingElement.transformation
  );

  const stickerStyle = await container.create(SharedMap);
  stickerStyle.set(
    "baseStyleId",
    textStickerDrawingElement.stickerStyle.baseStyleId
  );
  stickerStyle.set(
    "fontName",
    textStickerDrawingElement.stickerStyle.fontName ?? ""
  );
  stickerStyle.set(
    "fontSize",
    textStickerDrawingElement.stickerStyle.fontSize ?? ""
  );
  stickerStyle.set(
    "themeId",
    textStickerDrawingElement.stickerStyle.themeId ?? 0
  );
  stickerStyle.set(
    "textColor",
    textStickerDrawingElement.stickerStyle.textColor ?? ""
  );
  stickerStyle.set(
    "backgroundColor",
    textStickerDrawingElement.stickerStyle.backgroundColor ?? ""
  );
  stickerStyle.set(
    "backgroundAlpha",
    textStickerDrawingElement.stickerStyle.backgroundAlpha ?? 1
  );
  stickerStyle.set(
    "cornerRadius",
    textStickerDrawingElement.stickerStyle.cornerRadius ?? 0
  );
  stickerStyle.set(
    "borderWidth",
    textStickerDrawingElement.stickerStyle.borderWidth ?? 0
  );
  stickerStyle.set(
    "borderColor",
    textStickerDrawingElement.stickerStyle.borderColor ?? ""
  );
  sharedTextStickerDrawingElement.set("stickerStyle", stickerStyle.handle);

  const sharedText = await container.create(SharedString);
  sharedText.insertText(0, textStickerDrawingElement.text);
  sharedTextStickerDrawingElement.set("text", sharedText.handle);

  // add sharedTextStickerDrawingElement to drawingElementsMap
  const drawingElementsMap = container.initialObjects
    .drawingElementsMap as SharedMap;
  drawingElementsMap.set(
    sharedTextStickerDrawingElement.get("id") as string,
    sharedTextStickerDrawingElement.handle
  );

  // add sharedTextStickerDrawingElement id to page's drawing elements
  const page = (container.initialObjects.pageMap as SharedMap).get(
    pageId
  ) as SharedMap;
  const drawingElements = page.get(
    "drawingElements"
  ) as SharedObjectSequence<string>;
  drawingElements.insert(drawingElements.getLength(), [
    sharedTextStickerDrawingElement.get("id") as string,
  ]);
};

export interface DocumentModel {
  documentID: string; // uuid
  rom: ROM;
  dom: DOM;
}

export interface ROM {
  pageList: PageElement[];
}

export interface PageElement {
  pageId: string; // uuid
  width: number;
  height: number;
  rotation: number;
  drawingElements: IDrawingElements[];
  outputPathHolder: PathHolder;
  associateEntities: Entity[];
}

export interface Transformation {
  rotation: number;
  translationX: number;
  translationY: number;
  scaleX: number;
  scaleY: number;
}

export interface PathHolder {
  path: string;
  isPathOwner: boolean;
}

export interface DOM {
  entityMap: Map<string, Entity>;
  documentProperties: DocumentProperties;
}

export interface DocumentProperties {
  title: string;
  imageCompression: number; // enum
  imageDPI: number; // enum
}

export interface TextStickerStyle {
  baseStyleId: string; // enum
  fontName?: string;
  fontSize?: string;
  themeId?: number; // enum
  textColor?: string;
  backgroundColor?: string;
  backgroundAlpha?: number;
  cornerRadius?: number;
  borderWidth?: number;
  borderColor?: string;
}

export interface Point {
  x: number;
  y: number;
}

export interface Stroke {
  color: string;
  points: Point[];
  width: number;
}

export interface IDrawingElements {
  type: string;
  id: string; // uuid
  width: number;
  height: number;
  transformation: Transformation;
}

export interface ImageDrawingElement extends IDrawingElements {
  imageId: string; // uuid
}

export interface VideoDrawingElement extends IDrawingElements {
  videoId: string; // uuid
}

export interface ImageStickerDrawingElement extends IDrawingElements {
  assetId: string; // uuid
}

export interface TextStickerDrawingElement extends IDrawingElements {
  text: string;
  stickerStyle: TextStickerStyle;
}

export interface InkDrawingElement extends IDrawingElements {
  strokes: Stroke[];
}

export interface ImageEntityInfo {
  caption: string;
}

export interface VideoEntityInfo {
  caption: string;
}

export interface CroppingQuad {
  topLeft: Point;
  topRight: Point;
  bottomRight: Point;
  bottomLeft: Point;
}

export interface CropData {
  croppingQuad: CroppingQuad;
  rectifiedQuadWidth: number;
  rectifiedQuadHeight: number;
}

export interface OriginalImageInfo {
  imagePath: string;
  exifData?: any;
  baseQuad?: CroppingQuad;
  rotation: number;
  sourceImageUri: string;
  width: number;
  height: number;

  // moved from ImageEntityInfo
  source: string; // enum
  createdTime: string;
}

export interface ProcessedImageInfo {
  workflowType: string;
  filter: number;
  cropData?: CropData;
  pathHolder: PathHolder;
}

export interface OriginalClipData {
  duration: number;
  path: string;
}

export interface TrimData {
  startDuration: number;
  endDuration: number;
}

export interface ProcessedClipData {
  trimData: TrimData;
  pathHolder: PathHolder;
}

export interface OriginalVideoInfo {
  sourceVideoUri: string;
  clipData: OriginalClipData[];
  videoPath: string;

  // moved from VideoEntityInfo
  source: string; // enum
  createdTime: string;
}

export interface ProcessedVideoInfo {
  pathHolder: PathHolder;
  clipData: ProcessedClipData[];
}

export interface Entity {
  entityID: string; // uuid
  type: string;
  identity: string;
}

export interface ImageEntity extends Entity {
  imageEntityInfo: ImageEntityInfo;
  originalImageInfo: OriginalImageInfo;
  processedImageInfo: ProcessedImageInfo;
  state: string; // enum
  associatedEntities: [Entity];
}

export interface VideoEntity extends Entity {
  videoEntityInfo: VideoEntityInfo;
  originalVideoInfo: OriginalVideoInfo;
  processedVideoInfo: ProcessedVideoInfo;
  state: string; // enum
  associatedEntities: [Entity];
}

export interface ExtractionLanguageEntity extends Entity {
  extractionLanguage: string; // enum
}

export interface ExtractedEntity extends Entity {
  extractedContent?: string;
}
