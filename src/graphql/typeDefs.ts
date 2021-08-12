import { gql } from "apollo-server-express";

const typedefs = gql`
  type User {
    id: ID!
    isAnonymous: Boolean!
    refreshCount: Int!
  }

  type Auth {
    accessToken: String
    refreshToken: String
  }

  type Query {
    hello: String!
    me: User!
  }

  type Mutation {
    createAnonymousUser: Auth!
    logOutOfAllDevices: Boolean!
    upgradeAccountToEmailPassword(email: String!, password: String!): Auth
  }
`;
export default typedefs;
