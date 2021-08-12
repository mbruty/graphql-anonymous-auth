import {
  createAnonymousUser,
  meQuery,
  logOutOfAllDevices,
  upgradeAccountToEmailPassword,
} from "../resolvers/user";
const resolvers = {
  Query: {
    hello: () => "world",
    me: meQuery,
  },

  Auth: {
    accessToken: (_, __, { req }) => {
      if (req.tokensUpdated) {
        return req.accessToken;
      }
    },
    refreshToken: (_, __, { req }) => {
      if (req.tokensUpdated) {
        return req.refreshToken;
      }
    },
  },

  Mutation: {
    createAnonymousUser,
    logOutOfAllDevices,
    upgradeAccountToEmailPassword,
  },
};

export default resolvers;
