import {GET_COUNTRIES} from "../../../src/apollo/queries/countries"

const GET_COUNTRIES_MOCK =[
    {
      request: {
        query: GET_COUNTRIES,
      },
      result: {
        data: {
          countries: [
             {name: "Andorra", code: "AD"}
          , {name: "United Arab Emirates", code: "AE"}
          , {name: "Afghanistan", code: "AF"}
          , {name: "Antigua and Barbuda", code: "AG"}
          , {name: "Anguilla", code: "AI"}
          , {name: "Albania", code: "AL"}
          ,{name: "United States", code: "US"}]
        },
        loading: false
      },
    },
  ];

  export { GET_COUNTRIES_MOCK}