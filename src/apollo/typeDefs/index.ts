import gql from 'graphql-tag';

export const typeDefs= gql`
    type Country{
        name: string!
        code: string!
    }

type NewType{
    obj:object
}
    type Query {
        countries: [NewType!]!
    }
`
