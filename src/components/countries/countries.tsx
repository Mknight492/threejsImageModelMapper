import React, { Fragment } from 'react';
import { Query, QueryResult } from 'react-apollo';
import gql from 'graphql-tag';

const GET_COUNTRIES = gql`
      {
    countries {
      name
      code
    }
  }
`

interface countryObj{
    code: string,
    name: string
}

const Countries : React.FunctionComponent = () =>{

    const [currentCountry, setCurrentCountry] = React.useState({country: "US"})

    const onCountryChange =(event : React.FormEvent<HTMLSelectElement>) => {
        setCurrentCountry( {country:event.currentTarget.value})
    }

    return(
        <Query query={GET_COUNTRIES}>
        {({loading, error, data}:QueryResult) => {
          if (loading) return <p>Loading...</p>;
          if (error) return <p>{error.message}</p>;
          return (
            <select value={currentCountry.country} onChange={onCountryChange}>
            {/*need to define a country interface */}
              {data.countries.map((country:countryObj) => (     
                <option key={country.code} value={country.code}>
                  {country.name}
                </option>
              ))}
            </select>
          );
        }}
      </Query>
    )
}

export default Countries;