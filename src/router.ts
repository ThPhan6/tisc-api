import * as Hapi from '@hapi/hapi';
import AboutRoute from './api/about/about.route'
export default class Router {
    public static async loadRoutes(server: Hapi.Server): Promise<any> {
        await new AboutRoute().register(server)
    }
}