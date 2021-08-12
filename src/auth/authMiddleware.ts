import { IUser } from "../interfaces";
import User from "../models/user";
import { verify } from "jsonwebtoken";
import createTokens from "./createTokens";

const authMiddleware = async (req, res, next) => {
  let accessToken: string = req.cookies["access-token"];
  let refreshToken: string = req.cookies["refresh-token"];

  if (!accessToken && !refreshToken) {
    // We aren't logged in
    console.log("Not logged in");

    return next();
  }

  // Try verify the acces token
  try {
    const data = verify(accessToken, process.env.ACCESS_SECRET);
    req.refreshCount = data.refreshCount;
    req.userId = data.userId;
    req.user = data;
    req.validAuth = true;
    return next();
  } catch (e) {}

  // Access token is invalid

  // Verify the refreshToken
  let data;
  try {
    data = verify(refreshToken, process.env.REFRESH_SECRET);
    req.userId = data.userId;
    req.user = data;
    req.validAuth = true;
  } catch (e) {
    console.log("INVALID AUTH");
    req.validAuth = false;
    return next();
  }

  const user: IUser = await User.findById(data.userId);

  if (data.refreshCount !== user.refreshCount) {
    req.validAuth = false;
    return next();
  }
  const newTokens = createTokens(user);
  res.cookie("access-token", newTokens.accessToken, {
    sameSite: "none",
    secure: true,
  });
  res.cookie("refresh-token", newTokens.refreshToken, {
    sameSite: "none",
    secure: true,
  });
  req.accessToken = newTokens.accessToken;
  req.refreshToken = newTokens.refreshToken;
  req.tokensUpdated = true;
  req.refreshCount = data.refreshCount;

  next();
};

export default authMiddleware;
