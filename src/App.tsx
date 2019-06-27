import React from "react";

import ImageModelMapper from "./pages/labelingInterface/container";
import AddImage from "./pages/addImage";

const App = () => {
  const [currentPage, setStateCurrentPage] = React.useState<IPages>("labeling");

  switch (currentPage) {
    case "labeling":
      return <ImageModelMapper setStatePage={setStateCurrentPage} />;
    case "addingImages":
      return <AddImage setStatePage={setStateCurrentPage} />;
  }
};

export type IPages = "labeling" | "addingImages";

export default App;
