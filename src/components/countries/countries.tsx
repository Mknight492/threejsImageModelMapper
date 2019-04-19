import React from "react";
import { Query, QueryResult } from "react-apollo";

import { GET_COUNTRIES } from "../../apollo/queries/countries";

import Loading from "../../components/loading/loading";
import Error from "../../components/error/error";
interface countryObj {
  code: string;
  name: string;
}

const Countries: React.FunctionComponent = () => {
  const [currentCountry, setCurrentCountry] = React.useState({ country: "US" });

  const onCountryChange = (event: React.FormEvent<HTMLSelectElement>) => {
    setCurrentCountry({ country: event.currentTarget.value });
  };

  return (
    <Query query={GET_COUNTRIES}>
      {({ loading, error, data }: QueryResult) => {
        if (loading) return <Loading />;
        if (error) return <Error error={error} />;
        return (
          <select
            value={currentCountry.country}
            onChange={onCountryChange}
            data-testid="CountriesSelector"
          >
            {/*need to define a country interface */}
            {data.countries.map((country: countryObj) => (
              <option key={country.code} value={country.code}>
                {country.name}
              </option>
            ))}
          </select>
        );
      }}
    </Query>
  );
};

export default Countries;
