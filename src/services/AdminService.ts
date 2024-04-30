import { IAdminServer } from "models/IAdminServer";
import $api from "../http";
import { AxiosResponse } from 'axios'
import { IDeleteServerRequest } from "models/IDeleteServerRequest";
import { IAddServerRequest } from "models/IAddServerRequest";
import { IBanUnbanRequest } from "models/IBanUnbanRequest";
import { IAddRemoveAdminRequest } from "models/IAddRemoveAdminRequest";

export default class AdminService {
    static async getServers(): Promise<AxiosResponse<IAdminServer[]>> {
        return $api.post<IAdminServer[]>('api/admin/GetServers');
    }
    static async deleteServer(data: IDeleteServerRequest): Promise<AxiosResponse> {
        return $api.post('api/admin/RemoveServer', data);
    }
    static async addServer(data: IAddServerRequest): Promise<AxiosResponse> {
        return $api.post('api/admin/AddServer', data);
    }
    static async getPlayers(): Promise<AxiosResponse> {
        return $api.post('api/admin/GetPlayers');
    }
    static async banUnban(data: IBanUnbanRequest): Promise<AxiosResponse> {
        return $api.post('api/admin/BanPlayer', data);
    }
    static async getAdmins(): Promise<AxiosResponse> {
        return $api.post('api/admin/GetAdmins');
    }
    static async addRemoveAdmin(data: IAddRemoveAdminRequest): Promise<AxiosResponse> {
        return $api.post('api/admin/AddRemoveAdmin', data);
    }
}
