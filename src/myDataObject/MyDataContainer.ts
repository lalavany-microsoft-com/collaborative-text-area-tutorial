import { BaseContainerRuntimeFactory } from "@fluidframework/aqueduct";
import {
  requestFluidObject,
  RequestParser,
} from "@fluidframework/runtime-utils";
import { IFluidRouter } from "@fluidframework/core-interfaces";
import { IContainerRuntime } from "@fluidframework/container-runtime-definitions";
import { MyDataInstantiationFactory } from "./MyDataObject";

const myDataId = "myData";

// All requests will be routed to the ContactCollection, so e.g. of the format "/contactId".
// If we wanted to permit routing to other DO's then we might use a url format more like
// "/contactCollection/contactId".
const myDataRequestHandler = async (
  request: RequestParser,
  runtime: IContainerRuntime
) => {
  const response = await requestFluidObject<IFluidRouter>(
    await runtime.getRootDataStore(myDataId),
    request
  );
  return { status: 200, mimeType: "fluid/object", value: response };
};

class MyDataContainerFactoryType extends BaseContainerRuntimeFactory {
  constructor() {
    super(new Map([MyDataInstantiationFactory.registryEntry]), undefined, [
      myDataRequestHandler,
    ]);
  }

  protected async containerInitializingFirstTime(runtime: IContainerRuntime) {
    await runtime.createRootDataStore(
      MyDataInstantiationFactory.type,
      myDataId
    );
  }
}

export const MyDataContainerFactory = new MyDataContainerFactoryType();
