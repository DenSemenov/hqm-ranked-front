import $api from "../http";
import { IAuthResponse } from "../models/IAuthResponse";
import { ILoginRequest } from "../models/ILoginRequest";
import { AxiosResponse } from 'axios'
import { ICurrentUserResponse } from "models/ICurrentUserResponse";
import { IChangePasswordRequest } from "models/IChangePasswordRequest";
import { IRegisterRequest } from "models/IRegisterRequest";
import { IChangeNicknameRequest } from "models/IChangeNicknameRequest";
import { IPushTokenRequest } from "models/IPushTokenRequest";
import { IPlayerNotificationsResponse } from "models/IPlayerNotificationsResponse";
import { IWebsiteSettingsResponse } from "models/IWebsiteSettingsResponse";
import { IDiscordAuthRequest } from "models/IDiscordAuthRequest";

export default class AuthService {
    static async login(data: ILoginRequest): Promise<AxiosResponse<IAuthResponse>> {
        return $api.post<IAuthResponse>('api/player/login', data);
    }
    static async loginWithDiscord(data: IDiscordAuthRequest): Promise<AxiosResponse<IAuthResponse>> {
        return $api.post<IAuthResponse>('api/player/LoginWithDiscord', data);
    }

    static async register(data: IRegisterRequest): Promise<AxiosResponse<IAuthResponse>> {
        return $api.post<IAuthResponse>('api/player/register', data);
    }

    static async getCurrentUser(): Promise<AxiosResponse<ICurrentUserResponse>> {
        return $api.post<ICurrentUserResponse>('api/player/GetCurrentUser');
    }

    static async changePassword(data: IChangePasswordRequest): Promise<AxiosResponse> {
        return $api.post('api/player/ChangePassword', data);
    }

    static async changeNickname(data: IChangeNicknameRequest): Promise<AxiosResponse> {
        return $api.post('api/player/ChangeNickname', data);
    }
    static async addPushToken(data: IPushTokenRequest): Promise<AxiosResponse> {
        return $api.post('api/player/AddPushToken', data);
    }
    static async removePushToken(data: IPushTokenRequest): Promise<AxiosResponse> {
        return $api.post('api/player/RemovePushToken', data);
    }
    static async getPlayerNotifications(): Promise<AxiosResponse<IPlayerNotificationsResponse>> {
        return $api.post<IPlayerNotificationsResponse>('api/player/GetPlayerNotifications');
    }
    static async savePlayerNotifications(data: IPlayerNotificationsResponse): Promise<AxiosResponse> {
        return $api.post('api/player/SavePlayerNotifications', data);
    }
    static async acceptRules(): Promise<AxiosResponse> {
        return $api.post('api/player/AcceptRules');
    }
    static async getWebsiteSettings(): Promise<AxiosResponse<IWebsiteSettingsResponse>> {
        return $api.post<IWebsiteSettingsResponse>('api/player/GetWebsiteSettings');
    }
    static async setDiscordByToken(data: IDiscordAuthRequest): Promise<AxiosResponse> {
        return $api.post('api/player/SetDiscordByToken', data);
    }
    static async removeDiscord(): Promise<AxiosResponse> {
        return $api.post('api/player/RemoveDiscord');
    }
}
