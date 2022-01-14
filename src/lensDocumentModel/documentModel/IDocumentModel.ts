import { IDOM } from "../DOM/IDOM";
import { IROM } from "../ROM/IROM";

export interface IDocumentModel {
  documentId: string;
  dom: IDOM;
  rom: IROM;
}

export const createDocumentModel = async (): Promise<IDocumentModel> => {
  return {} as IDocumentModel;
};

export const getDocumentModel = async (
  _documentID: string
): Promise<IDocumentModel> => {
  return {} as IDocumentModel;
};

export enum LensWorkflowType {
  photo,
  scan,
  video,
}
