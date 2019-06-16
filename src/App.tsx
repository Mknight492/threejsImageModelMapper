import React, { Component } from "react";

import Glasses from "./pages/glasses/scratch";
import Test from "./pages/glasses/container";
class App extends Component {
  render() {
    return (
      <>
        <Test />
        <Glasses />
      </>
    );
  }
}

export default App;
