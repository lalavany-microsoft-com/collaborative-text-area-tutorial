// import {
//   IFluidHandle,
//   IFluidLoadable,
//   IFluidObject,
// } from "@fluidframework/core-interfaces";
// import {} from "@fluidframework/runtime-definitions";
// export class MyImage implements IFluidLoadable {
//   private readonly innerHandle: IFluidHandle;
//   private imageBase64: string;
//   constructor(imageBase64: string) {
//     this.innerHandle = new MyImageHanddle(this);
//     this.imageBase64 = imageBase64;
//   }
//   public get handle(): IFluidHandle<
//     IFluidObject & Partial<Pick<unknown, never>> & IFluidLoadable
//   > {
//     return this.innerHandle;
//   }
//   public get IFluidLoadable(): IFluidLoadable {
//     return this;
//   }
//   public get imageBlobURL(): string {
//     return this.imageBase64;
//   }
//   readonly factory: IFluidDataStoreFactory = {};
// }

// export class MyImageHanddle implements IFluidHandle {
//   absolutePath: string = "";
//   isAttached: boolean = false;
//   myImage: MyImage;

//   constructor(myImage: MyImage) {
//     this.myImage = myImage;
//   }
//   attachGraph(): void {}
//   get(): Promise<
//     IFluidObject & Partial<Pick<unknown, never>> & IFluidLoadable
//   > {
//     return Promise.resolve(this.myImage);
//   }
//   bind(
//     handle: IFluidHandle<
//       IFluidObject & Partial<Pick<unknown, never>> & IFluidLoadable
//     >
//   ): void {}
//   public get IFluidHandle(): IFluidHandle<
//     IFluidObject & Partial<Pick<unknown, never>> & IFluidLoadable
//   > {
//     return this;
//   }
// }

// /*export class MyLoadableImage extends IFluidLoadable {}

// export const MyImageInstantiationFactory = new DataObjectFactory(
//   "MyImage",
//   MyImage,
//   [],
//   {}
// );

// export const fluidExport = new ContainerRuntimeFactoryWithDefaultDataStore(
//   MyImageInstantiationFactory,
//   new Map([MyImageInstantiationFactory.registryEntry])
// );
// */
export {};
