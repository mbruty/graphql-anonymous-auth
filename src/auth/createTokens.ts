import { IUser } from "../interfaces";
import { sign } from "jsonwebtoken";

export default (user: IUser) => {
  const refreshToken: string = sign(
    {
      userId: user._id,
      isAnonymous: user.isAnonymous,
      refreshCount: user.refreshCount,
    },
    process.env.REFRESH_SECRET,
    { expiresIn: user.isAnonymous ? "999y" : "7d" }
  );

  const accessToken: string = sign(
    {
      userId: user._id,
      isAnonymous: user.isAnonymous,
      refreshCount: user.refreshCount,
    },
    process.env.ACCESS_SECRET,
    { expiresIn: "10s" }
  );

  return { refreshToken, accessToken };
};
