import crypto from "crypto";
import * as bcrypt from "bcryptjs";

const bcryptSalt = 10;

const salt = bcrypt.genSaltSync(bcryptSalt);

export const createHash = (password: string) => {
  return bcrypt.hashSync(password, salt);
};

export const createHashWithSalt = (password: string) => {
  const randomSalt = bcrypt.genSaltSync(bcryptSalt);
  const hash = bcrypt.hashSync(password, randomSalt);
  return { hash, randomSalt };
};

export const comparePassword = (password: string, hash: string) => {
  return bcrypt.compareSync(password, hash);
};

export const createResetPasswordToken = () => {
  return crypto.randomBytes(64).toString("hex");
};

export const createRandomString = (n: number) => {
  return crypto.randomBytes(n).toString("hex");
};
