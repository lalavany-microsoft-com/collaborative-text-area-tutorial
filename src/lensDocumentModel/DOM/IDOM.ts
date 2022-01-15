import { IDocumentProperties } from "../documentProperties/IDocumentProperties";
import { IEntity } from "../entity/IEntity";

export interface IDOM {
  getDocumentProperties: () => IDocumentProperties;
  addEntity: (entity: IEntity) => void;
  removeEntity: (entityId: string) => void;
  getEntity: (entityId: string) => IEntity;
}
