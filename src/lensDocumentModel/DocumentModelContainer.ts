import { BaseContainerRuntimeFactory } from "@fluidframework/aqueduct";
import {
  requestFluidObject,
  RequestParser,
} from "@fluidframework/runtime-utils";
import { IFluidRouter } from "@fluidframework/core-interfaces";
import { IContainerRuntime } from "@fluidframework/container-runtime-definitions";
import { DocumentModel } from "./documentModel/DocumentModelDataObject";

const documentModelId = "documentModel";

const myDataRequestHandler = async (
  request: RequestParser,
  runtime: IContainerRuntime
) => {
  const response = await requestFluidObject<IFluidRouter>(
    await runtime.getRootDataStore(documentModelId),
    request
  );
  return { status: 200, mimeType: "fluid/object", value: response };
};

class DocumentModelContainerFactoryType extends BaseContainerRuntimeFactory {
  constructor() {
    super(new Map([DocumentModel.getFactory().registryEntry]), undefined, [
      myDataRequestHandler,
    ]);
  }

  protected async containerInitializingFirstTime(runtime: IContainerRuntime) {
    await runtime.createRootDataStore(
      DocumentModel.getFactory().type,
      documentModelId
    );
  }
}

export const DocumentModelContainerFactory =
  new DocumentModelContainerFactoryType();
