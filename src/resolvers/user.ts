import createTokens from "../auth/createTokens";
import User from "../models/user";
import { AuthenticationError, ForbiddenError } from "apollo-server-errors";

export const createAnonymousUser = async (_, __, { req, res }) => {
  if (req.validAuth) {
    return;
  }
  const user = new User();
  await user.save();
  const newTokens = createTokens(user);

  res.cookie("access-token", newTokens.accessToken, {
    sameSite: "none",
    secure: true,
  });
  res.cookie("refresh-token", newTokens.refreshToken, {
    sameSite: "none",
    secure: true,
  });
  console.log({
    accessToken: newTokens.accessToken,
    refreshToken: newTokens.refreshToken,
  });

  req.accessToken = newTokens.accessToken;
  req.refreshToken = newTokens.refreshToken;
  req.tokensUpdated = true; // Tell the Auth resolver to return the tokens
  return {};
};

export const meQuery = async (_, __, { req }) => {
  if (req.validAuth) {
    const user = await User.findById(req.userId);
    console.log(user);
    return user;
  } else {
    throw new AuthenticationError("You are not logged in");
  }
};

export const logOutOfAllDevices = async (_, __, { req }) => {
  const success = await User.updateOne(
    { _id: req.userId },
    { refreshCount: req.refreshCount + 1 }
  );
  console.log(success);

  return success.ok !== 0;
};

export const upgradeAccountToEmailPassword = async (
  _,
  { email, password },
  { req }
) => {
  if (req.validAuth) {
    const user = await User.findById(req.userId);
    if (user.isAnonymous) {
      const result = await User.updateOne(
        { _id: req.userId },
        { email: email, password: password }
      );
      console.log(result);
    } else {
      throw new ForbiddenError("You are not anonymous!");
    }
  }
};
