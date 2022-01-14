import { IDocumentProperties } from "../documentProperties/IDocumentProperties";
import { IEntity } from "../entity/IEntity";

export interface IDOM {
  documentProperties: IDocumentProperties;
  entityMap: Map<string, IEntity>;
}
