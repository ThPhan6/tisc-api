import crypto from "crypto";
import * as bcrypt from "bcryptjs";

const bcryptSalt = 10;

const salt = bcrypt.genSaltSync(bcryptSalt);

export const createHash = (password: string) => {
  const hash = bcrypt.hashSync(password, salt);
  return hash;
};

export const createHashWithSalt = (password: string) => {
  const salt = bcrypt.genSaltSync(bcryptSalt);
  const hash = bcrypt.hashSync(password, salt);
  return { hash, salt };
};

export const comparePassword = (password: string, hash: string) => {
  return bcrypt.compareSync(password, hash);
};

export const createResetPasswordToken = () => {
  const str = crypto.randomBytes(64).toString("hex");
  return str;
};

export const createRandomString = (n: number) => {
  const str = crypto.randomBytes(n).toString("hex");
  return str;
};
