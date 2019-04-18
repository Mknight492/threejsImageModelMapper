import gql from "graphql-tag"

const GET_COUNTRIES = gql`
  query getCountries{
    countries {
      name
      code
    }
  }
`;

export{GET_COUNTRIES}
