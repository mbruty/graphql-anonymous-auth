import { IUser } from "../interfaces";
import { Schema, model } from "mongoose";
const bcrypt = require("bcrypt");

const userSchema = new Schema({
  isAnonymous: { type: Boolean, required: true, default: true },
  refreshCount: { type: Number, required: true, default: 0 },
  email: { type: String, required: false },
  password: { type: String, required: false },
});

userSchema.pre("updateOne", function (next) {
  const user: any = this;
  // Only hash the password if it's modified
  const password = user.getUpdate().password;
  if (!password) return next();

  bcrypt.genSalt(10, (err, salt) => {
    if (err) return next(err);

    // Hash the password
    bcrypt.hash(password, salt, (err, hash) => {
      if (err) return next(err);

      // Set the user.password to the hashed result
      user.getUpdate().password = hash;
      next();
    });
  });
});

export default model<IUser>("Users", userSchema);
