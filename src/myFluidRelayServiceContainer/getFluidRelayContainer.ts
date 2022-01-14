import {
  IContainer,
  IRuntimeFactory,
} from "@fluidframework/container-definitions";
import { InsecureTokenProvider } from "@fluidframework/test-client-utils";
import { RouterliciousDocumentServiceFactory } from "@fluidframework/routerlicious-driver";
import { AzureUrlResolver } from "./AzureUrlResolver";

import { IRequest } from "@fluidframework/core-interfaces";

import { DriverHeader } from "@fluidframework/driver-definitions";
import { ensureFluidResolvedUrl } from "@fluidframework/driver-utils";
import { createContainer, getContainer } from "./getContainer";

const tenantID = "e41367db-fd25-4666-8715-06d284ef2da9";
const key = "0b18b03e6f2db956a78b30862cb62566";
const orderer = "https://alfred.southeastasia.fluidrelay.azure.com";
const storage = "https://historian.southeastasia.fluidrelay.azure.com";

export async function getFluidRelayContainer(
  documentId: string,
  containerRuntimeFactory: IRuntimeFactory,
  createNew: boolean
): Promise<[IContainer, string]> {
  const tokenProvider = new InsecureTokenProvider(
    key /* REPLACE WITH YOUR PRIMARY KEY */,
    { id: "userId" }
  );
  const documentServiceFactory = new RouterliciousDocumentServiceFactory(
    tokenProvider,
    { enableWholeSummaryUpload: true }
  );
  const urlResolver = new AzureUrlResolver();

  let container: IContainer;
  if (createNew) {
    container = await createContainer({
      documentServiceFactory,
      urlResolver,
      containerRuntimeFactory,
      request: createAzureCreateNewRequest(orderer, storage, tenantID),
    });
  } else {
    const url = new URL(orderer);
    url.searchParams.append("storage", encodeURIComponent(storage));
    url.searchParams.append("tenantId", encodeURIComponent(tenantID));
    url.searchParams.append("containerId", encodeURIComponent(documentId));
    container = await getContainer({
      documentServiceFactory,
      urlResolver,
      containerRuntimeFactory,
      request: { url: url.href },
    });
  }
  const resolved = container.resolvedUrl;
  ensureFluidResolvedUrl(resolved);
  const containerId = resolved.id;
  return [container, containerId];
}

export const createAzureCreateNewRequest = (
  ordererUrl: string,
  storageUrl: string,
  tenantId: string
): IRequest => {
  const url = new URL(ordererUrl);
  url.searchParams.append("storage", encodeURIComponent(storageUrl));
  url.searchParams.append("tenantId", encodeURIComponent(tenantId));
  return {
    url: url.href,
    headers: {
      [DriverHeader.createNew]: true,
    },
  };
};
