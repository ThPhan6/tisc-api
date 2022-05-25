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

export const signAdminToken = (user_id: string) => {
  return Jwt.token.generate(
    {
      aud: "urn:audience:test",
      iss: "urn:issuer:test",
      user_id,
    },
    {
      key: jwtConfig.jwtAdminSecret,
      algorithm: "HS512",
    },
    {
      ttlSec: jwtConfig.ttlSec,
    }
  );
};

export const signBrandAdminToken = (user_id: string) => {
  return Jwt.token.generate(
    {
      aud: "urn:audience:test",
      iss: "urn:issuer:test",
      user_id,
    },
    {
      key: jwtConfig.jwtBrandAdminSecret,
      algorithm: "HS512",
    },
    {
      ttlSec: jwtConfig.ttlSec,
    }
  );
};
export const signDesignAdminToken = (user_id: string) => {
  return Jwt.token.generate(
    {
      aud: "urn:audience:test",
      iss: "urn:issuer:test",
      user_id,
    },
    {
      key: jwtConfig.jwtDesignAdminSecret,
      algorithm: "HS512",
    },
    {
      ttlSec: jwtConfig.ttlSec,
    }
  );
};

export const signConsultantTeamToken = (user_id: string) => {
  return Jwt.token.generate(
    {
      aud: "urn:audience:test",
      iss: "urn:issuer:test",
      user_id,
    },
    {
      key: jwtConfig.jwtConsultantTeamSecret,
      algorithm: "HS512",
    },
    {
      ttlSec: jwtConfig.ttlSec,
    }
  );
};
export const signBrandTeamToken = (user_id: string) => {
  return Jwt.token.generate(
    {
      aud: "urn:audience:test",
      iss: "urn:issuer:test",
      user_id,
    },
    {
      key: jwtConfig.jwtBrandTeamSecret,
      algorithm: "HS512",
    },
    {
      ttlSec: jwtConfig.ttlSec,
    }
  );
};
export const signDesignTeamToken = (user_id: string) => {
  return Jwt.token.generate(
    {
      aud: "urn:audience:test",
      iss: "urn:issuer:test",
      user_id,
    },
    {
      key: jwtConfig.jwtDesignTeamSecret,
      algorithm: "HS512",
    },
    {
      ttlSec: jwtConfig.ttlSec,
    }
  );
};

export const decodedToken = (token: string): any => {
  try {
    return Jwt.token.decode(token);
  } catch (err) {
    return false;
  }
};

export const verifyAdminToken = (token: string): IVerifyTokenResponse => {
  return verifyToken(decodedToken(token), jwtConfig.jwtAdminSecret);
};
export const verifyBrandAdminToken = (token: string): IVerifyTokenResponse => {
  return verifyToken(decodedToken(token), jwtConfig.jwtBrandAdminSecret);
};
export const verifyDesignAdminToken = (token: string): IVerifyTokenResponse => {
  return verifyToken(decodedToken(token), jwtConfig.jwtDesignAdminSecret);
};
export const verifyConsultantTeamToken = (
  token: string
): IVerifyTokenResponse => {
  return verifyToken(decodedToken(token), jwtConfig.jwtConsultantTeamSecret);
};
export const verifyBrandTeamToken = (token: string): IVerifyTokenResponse => {
  return verifyToken(decodedToken(token), jwtConfig.jwtBrandTeamSecret);
};
export const verifyDesignTeamToken = (token: string): IVerifyTokenResponse => {
  return verifyToken(decodedToken(token), jwtConfig.jwtDesignTeamSecret);
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
