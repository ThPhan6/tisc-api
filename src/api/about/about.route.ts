import * as Hapi from "@hapi/hapi";
import Model from "../../model/index";
const model = new Model("article");
export default class AboutRoute {
  public async register(server: Hapi.Server): Promise<any> {
    return new Promise((resolve) => {
      server.route([
        {
          method: "GET",
          path: `/api/about`,
          options: {
            handler: async (req: Hapi.Request, res: Hapi.ResponseToolkit) => {
              const a = await model.list(10, 0, { name: "Suu1", age: 24 });
              return res.response(a).code(200);
            },
            description: "Method that authenticate user",
            tags: ["api", "About"],
            auth: false,
          },
        },
        {
          method: "GET",
          path: `/api/about/{id}`,
          options: {
            handler: async (req: Hapi.Request, res: Hapi.ResponseToolkit) => {
              const { id } = req.params;
              const a: any = await model.find(id);
              return res.response(a).code(200);
            },
            description: "Method that authenticate user",
            tags: ["api", "About"],
            auth: false,
          },
        },
        {
          method: "POST",
          path: `/api/about`,
          options: {
            handler: async (req: Hapi.Request, res: Hapi.ResponseToolkit) => {
              const a: any = await model.create({ name: "Suu", age: 28 });
              return res.response(a).code(200);
            },
            description: "Method that authenticate user",
            tags: ["api", "About"],
            auth: false,
          },
        },
        {
          method: "PUT",
          path: `/api/about/{id}`,
          options: {
            handler: async (req: Hapi.Request, res: Hapi.ResponseToolkit) => {
              const { id } = req.params;
              const a: any = await model.update(id, {
                name: "Khanh1",
                age: 52,
                id: 1,
              });
              return res.response(a).code(200);
            },
            description: "Method that authenticate user",
            tags: ["api", "About"],
            auth: false,
          },
        },
        {
          method: "DELETE",
          path: `/api/about/{id}`,
          options: {
            handler: async (req: Hapi.Request, res: Hapi.ResponseToolkit) => {
              const { id } = req.params;
              const a: any = await model.delete(id);
              return res.response(a).code(200);
            },
            description: "Method that authenticate user",
            tags: ["api", "About"],
            auth: false,
          },
        },
      ]);
      resolve(true);
    });
  }
}
