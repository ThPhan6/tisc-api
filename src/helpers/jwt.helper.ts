import { jwtConfig } from "../config";
import * as Jwt from "@hapi/jwt";

interface IVerifyTokenResponse {
  isValid: boolean;
  error?: string;
}

export interface IDecodedToken {
  token: string;
  decoded: {
    header: {
      alg: string;
      typ: string;
    };
    payload: {
      aud: string;
      iss: string;
      user_id: string;
      role: string;
      group: string;
      iat: number;
      exp: number;
    };
    signature: string;
  };
  raw: {
    header: string;
    payload: string;
    signature: string;
  };
}

export const signJwtToken = (user_id: string) => {
  return Jwt.token.generate(
    {
      aud: "urn:audience:test",
      iss: "urn:issuer:test",
      user_id,
    },
    {
      key: jwtConfig.jwtSecret,
      algorithm: "HS512",
    },
    {
      ttlSec: jwtConfig.ttlSec,
    }
  );
}


export const decodedToken = (token: string): any => {
  try {
    return Jwt.token.decode(token);
  } catch (err) {
    return false;
  }
};

export const verifyJwtToken = (token: string): IVerifyTokenResponse => {
  return verifyToken(decodedToken(token), jwtConfig.jwtSecret);
};

const verifyToken = (artifact: any, secret: string): IVerifyTokenResponse => {
  try {
    Jwt.token.verify(artifact, secret);
    return { isValid: true };
  } catch (err: any) {
    return {
      isValid: false,
      error: err.message,
    };
  }
};
