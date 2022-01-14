import { getFluidRelayContainer } from "../myFluidRelayServiceContainer/getFluidRelayContainer";
import { IMyImage } from "./IMyImage";
import { MyDataContainerFactory } from "./MyDataContainer";

/*window.process.env.ID = "e3f8f682-bc70-4cb3-9691-9cf96be18d9a";
window.process.env.KEY = "92634b4ca55113af3e36c1ab70550261";
window.process.env.ORDERER =
  "https://alfred.southeastasia.fluidrelay.azure.com";
window.process.env.STORAGE =
  "https://historian.southeastasia.fluidrelay.azure.com";*/

export async function getContainer() {
  // when the document ID is not provided, create a new one.
  const shouldCreateNew = window.location.hash.length === 0;
  const documentId = !shouldCreateNew ? window.location.hash.substring(1) : "";

  const [container, containerId] = await getFluidRelayContainer(
    documentId,
    MyDataContainerFactory,
    shouldCreateNew
  );

  // update the browser URL and the window title with the actual container ID
  window.location.hash = containerId;
  document.title = containerId;

  // Since we're using a ContainerRuntimeFactoryWithDefaultDataStore, our contact collection is available
  // at the URL "/".  Since it's using the collection pattern, it will interpret subrequests as requests for a
  // single contact.
  const url = `/`;
  const response = await container.request({ url });

  // Verify the response to make sure we got what we expected.
  if (response.status !== 200 || response.mimeType !== "fluid/object") {
    throw new Error(`Unable to retrieve data object at URL: "${url}"`);
  } else if (response.value === undefined) {
    throw new Error(`Empty response from URL: "${url}"`);
  }

  return response.value as IMyImage;
}
