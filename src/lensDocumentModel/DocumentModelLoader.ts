import { getFluidRelayContainer } from "../myFluidRelayServiceContainer/getFluidRelayContainer";
import { IDocumentModel } from "./documentModel/IDocumentModel";
import { DocumentModelContainerFactory } from "./DocumentModelContainer";

export async function getContainer() {
  // when the document ID is not provided, create a new one.
  const shouldCreateNew = window.location.hash.length === 0;
  const documentId = !shouldCreateNew ? window.location.hash.substring(1) : "";

  const [container, containerId] = await getFluidRelayContainer(
    documentId,
    DocumentModelContainerFactory,
    shouldCreateNew
  );

  // update the browser URL and the window title with the actual container ID
  window.location.hash = containerId;
  document.title = containerId;

  const url = `/${containerId}`;
  const response = await container.request({ url });

  // Verify the response to make sure we got what we expected.
  if (response.status !== 200 || response.mimeType !== "fluid/object") {
    throw new Error(`Unable to retrieve data object at URL: "${url}"`);
  } else if (response.value === undefined) {
    throw new Error(`Empty response from URL: "${url}"`);
  }

  return response.value as IDocumentModel;
}
