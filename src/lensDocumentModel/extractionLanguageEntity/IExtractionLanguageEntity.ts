import { IEntity } from "../entity/IEntity";

export interface IExtractionLanguageEntity extends IEntity {
  extractionLanguage: LensLanguage;
}

export enum LensLanguage {
  auto,
  arabic,
  bulgarian,
  bosnian,
  chineseSimplified,
  chineseTraditional,
  croatian,
  czech,
  danish,
  dutch,
  english,
  finnish,
  french,
  german,
  greek,
  hungarian,
  italian,
  japanese,
  korean,
  norwegian,
  polish,
  portuguese,
  romanian,
  russian,
  serbianCyrillic,
  serbianLatin,
  slovak,
  slovenian,
  spanish,
  swedish,
  turkish,
}
