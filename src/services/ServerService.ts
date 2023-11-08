import { AxiosResponse } from "axios";
import $api from "../http";
import { IActiveServerResponse } from "models/IActiveServerResponse";

export default class ServerService {
    static async getActiveServers(): Promise<AxiosResponse<IActiveServerResponse[]>> {
        return $api.post<IActiveServerResponse[]>('api/server/GetActiveServers');
    }
}