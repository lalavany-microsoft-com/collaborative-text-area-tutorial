export interface IDocumentModel {
  getDocumentId: () => string;
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
