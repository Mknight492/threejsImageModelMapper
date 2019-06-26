import React from "react";
import ReactDOM from "react-dom";

import App from "./App";
import * as serviceWorker from "./serviceWorker";

//graphQL imports
import CustomProvider from "./graphql/configureAWSProvider";

//style imports
import GlobalStyles from "./styles/globalStyles";

ReactDOM.render(
  <CustomProvider>
    <GlobalStyles />
    <App />
  </CustomProvider>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
