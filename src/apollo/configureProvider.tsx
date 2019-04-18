import React, { Children } from "react";

//graphQL imports
import { ApolloClient } from "apollo-client";
import { InMemoryCache } from "apollo-cache-inmemory";
import { HttpLink } from "apollo-link-http";
import { ApolloProvider } from "react-apollo";

const cache = new InMemoryCache();
const link = new HttpLink({
  uri: "https://countries.trevorblades.com"
});
const client = new ApolloClient({
  cache,
  link
});

const CustomProvider: React.FunctionComponent = ({ children }) => {
  return <ApolloProvider client={client} children={children} />;
};

export default CustomProvider;
