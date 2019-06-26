import React from "react";

import appSyncConfig from "../aws-exports";
import { ApolloProvider } from "react-apollo";
import AWSAppSyncClient from "aws-appsync";
import { Rehydrated } from "aws-appsync-react";

const client = new AWSAppSyncClient({
  url: appSyncConfig.aws_appsync_graphqlEndpoint as string,
  region: appSyncConfig.aws_appsync_region as string,
  auth: {
    type: "API_KEY", //appSyncConfig.aws_appsync_authenticationType,
    apiKey: appSyncConfig.aws_appsync_apiKey
  }
});

const WithProvider: React.FunctionComponent = ({ children }) => (
  <ApolloProvider client={client as any}>
    <Rehydrated children={children} />
  </ApolloProvider>
);

export default WithProvider;
