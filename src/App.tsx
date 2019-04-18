import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

import CountrySelect from "./components/countries/countries"
class App extends Component {
  render() {
    return (
        <CountrySelect />
    );
  }
}

export default App;
