import{createGlobalStyle} from "styled-components"

const GlobalStyles = createGlobalStyle`
html {
    font-size: 10px; /* wouldn't allow users to overwrite base font size*/
    font-size: 62.5%; /*allows users to overwrite font size but translates to 10px*/
  }
  
  body {
    font-family: "europa", "Roboto", sans-serif;
    color: #555;
    overflow-x: visible;
    font-weight: 400;
    //font-size: 1rem;
    line-height: 1.65;
    box-sizing: border-box;
    scroll-behavior: smooth;
  }
  button:focus {
    outline: 0;
  }
  
  img {
    max-width: 100%;
    height: auto;
  }
  
  a {
    text-decoration: none;
  }
  
  *,
  *::after,
  *::before {
    padding: 0;
    margin: 0;
    box-sizing: inherit;
  }`

  export default GlobalStyles;
