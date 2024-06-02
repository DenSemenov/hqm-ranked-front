import { IAdminServer } from "models/IAdminServer";
import $api from "../http";
import { AxiosResponse } from 'axios'
import { IDeleteServerRequest } from "models/IDeleteServerRequest";
import { IAddServerRequest } from "models/IAddServerRequest";
import { IBanUnbanRequest } from "models/IBanUnbanRequest";
import { IAddRemoveAdminRequest } from "models/IAddRemoveAdminRequest";
import { ISettingsResponse } from "models/ISettingsResponse";
import { IAdminPlayerResponse } from "models/IAdminPlayerResponse";
import { IApproveRequest } from "models/IApproveRequest";
import { IAdminStoryRequest } from "models/IAdminStoryRequest";
import { IRemoveAdminStoryRequest } from "models/IRemoveAdminStoryRequest";
import { IAdminStoryResponse } from "models/IAdminStoryResponse";

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
    static async getSettings(): Promise<AxiosResponse<ISettingsResponse>> {
        return $api.post<ISettingsResponse>('api/admin/GetSettings');
    }
    static async saveSettings(data: ISettingsResponse): Promise<AxiosResponse> {
        return $api.post('api/admin/SaveSettings', data);
    }
    static async getUnApprovedUsers(): Promise<AxiosResponse<IAdminPlayerResponse[]>> {
        return $api.post<IAdminPlayerResponse[]>('api/admin/GetUnApprovedUsers');
    }
    static async approveUser(data: IApproveRequest): Promise<AxiosResponse> {
        return $api.post('api/admin/ApproveUser', data);
    }
    static async addAdminStory(data: IAdminStoryRequest): Promise<AxiosResponse> {
        return $api.post('api/admin/AddAdminStory', data);
    }
    static async removeAdminStory(data: IRemoveAdminStoryRequest): Promise<AxiosResponse> {
        return $api.post('api/admin/RemoveAdminStory', data);
    }
    static async getAdminStories(): Promise<AxiosResponse<IAdminStoryResponse[]>> {
        return $api.post<IAdminStoryResponse[]>('api/admin/GetAdminStories');
    }
}
