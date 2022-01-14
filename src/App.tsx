import "./App.css";

import React, { ChangeEvent } from "react";
import {getContainer} from "./myDataObject/MyDataLoader";
import { IMyImage } from "./myDataObject/IMyImage";

function App() {
  const [image, setImage] = React.useState<string>();
  const [sharedData, setSharedData] = React.useState<IMyImage>();
  
  React.useEffect(() => {
    getContainer().then(myImage => {
      setSharedData(myImage);
      myImage.on("imageChanged", async () => {
        myImage.getBlob().then(blob => {
          setImage(blob ? URL.createObjectURL(blob) : undefined);
        })
      });
    });
  },[]);

  const onImageSelected = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target?.files?.length && sharedData) {
        const file = e.target.files[0];
        sharedData.setBlob(file);
    }
};

  return (
    <div className="app">
      <input type="file" alt="" multiple={false} onChange={onImageSelected} accept={"image/*"} disabled={sharedData === undefined} />
      <img alt={`${image}`} src={image}/>
    </div>
  );
}

export default App;