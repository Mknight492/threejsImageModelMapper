import React, { Component } from "react";

import CountrySelect from "./components/countries/countries";
import Content from "./styles/mediaQueries";

import Button from "./components/buttons/button";
class App extends Component {
  render() {
    return (
      <>
        <CountrySelect />
        <Button color="pink" />
      </>
    );
  }
}

export default App;
