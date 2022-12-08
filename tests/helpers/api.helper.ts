import * as chai from "chai";

import chaiHttp = require("chai-http");

import { ENVIROMENT } from "../../src/config";

interface HttpRequestHeader {
  Authorization?: string;
  Signature?: string;
}

class HttpResponse {
  private response: ChaiHttp.Response;
  constructor(response: ChaiHttp.Response) {
    this.response = response;
  }

  public shouldError = (
    httpStatusCode: number = 400,
    showJsonBody: boolean = false
  ) => {
    if (showJsonBody) {
      this.displayJsonBody();
    }
    this.response.should.have.status(httpStatusCode);
    return this;
  };

  public shouldSuccess = (showJsonBody: boolean = false) => {
    if (showJsonBody) {
      this.displayJsonBody();
    }
    this.response.should.have.status(200);

    return this;
  };
  public get(key?: string) {
    if (key) {
      return this.response.body.data[key];
    }
    return this.response.body.data;
  }

  private displayJsonBody = () => {
    console.log(this.response.body);
  };
}

class HttpRequest {
  private apiInstance: ChaiHttp.Agent;
  private headers: HttpRequestHeader = {};
  private payload: object = {};
  constructor(apiInstance: ChaiHttp.Agent) {
    this.apiInstance = apiInstance;
  }

  public setToken = (token: string) => {
    this.headers = {
      ...this.headers,
      Authorization: `Bearer ${token}`,
    };
    return this;
  };
  public setSignature = (signature: string) => {
    this.headers = {
      ...this.headers,
      Signature: signature,
    };
    return this;
  };

  public setHeader = (header: HttpRequestHeader) => {
    this.headers = header;
    return this;
  };

  public send = (payload: object = {}) => {
    this.payload = payload;
  };

  public async patch(url: string, data?: object) {
    const response = (await new Promise((resolve) => {
      this.apiInstance
        .patch(url)
        .set(this.headers)
        .send(data ?? this.payload)
        .end((_err, response) => {
          resolve(response);
        });
    })) as ChaiHttp.Response;
    return new HttpResponse(response);
  }

  public async get(url: string) {
    const response = (await new Promise((resolve) => {
      this.apiInstance
        .get(url)
        .set(this.headers)
        .end((_err, response) => {
          resolve(response);
        });
    })) as ChaiHttp.Response;
    return new HttpResponse(response);
  }

  public async post(url: string, data?: object) {
    const response = (await new Promise((resolve) => {
      this.apiInstance
        .post(url)
        .set(this.headers)
        .send(data ?? this.payload)
        .end((_err, response) => {
          resolve(response);
        });
    })) as ChaiHttp.Response;
    console.log(response);
    return new HttpResponse(response);
  }

  public async put(url: string, data?: object) {
    const response = (await new Promise((resolve) => {
      this.apiInstance
        .put(url)
        .set(this.headers)
        .send(data ?? this.payload)
        .end((_err, response) => {
          resolve(response);
        });
    })) as ChaiHttp.Response;
    return new HttpResponse(response);
  }

  public async delete(url: string) {
    const response = (await new Promise((resolve) => {
      this.apiInstance
        .delete(url)
        .set(this.headers)
        .end((_err, response) => {
          resolve(response);
        });
    })) as ChaiHttp.Response;
    return new HttpResponse(response);
  }
}

export default class ApiService {
  private chai: Chai.ChaiStatic;
  constructor() {
    this.chai = chai.use(chaiHttp);
    this.chai.should();
  }
  public getInstance = () => {
    return new HttpRequest(this.chai.request(ENVIROMENT.API_URL));
  };
}
export const apiService = new ApiService();
