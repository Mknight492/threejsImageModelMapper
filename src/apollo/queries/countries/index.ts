import gql from "graphql-tag"

const GET_COUNTRIES = gql`
  {
    countries {
      name
      code
    }
  }
`;

export{GET_COUNTRIES}