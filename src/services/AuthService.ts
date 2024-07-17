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
import { IPlayerWarningResponse } from "models/IPlayerWarningResponse";
import { ICurrentUserInfoRequest } from "models/ICurrentUserInfoRequest";
import { IPlayerMapResponse } from "models/IPlayerMapResponse";
import { ISetShowLocationRequest } from "models/ISetShowLocationRequest";
import { IChangeLimitTypeRequest } from "models/IChangeLimitTypeRequest";

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
    static async getPlayerWarnings(): Promise<AxiosResponse<IPlayerWarningResponse[]>> {
        return $api.post<IPlayerWarningResponse[]>('api/player/GetPlayerWarnings');
    }
    static async setShowLocation(data: ISetShowLocationRequest): Promise<AxiosResponse> {
        return $api.post('api/player/SetShowLocation', data);
    }
    static async getMap(): Promise<AxiosResponse<IPlayerMapResponse[]>> {
        return $api.post<IPlayerMapResponse[]>('api/player/GetMap');
    }
    static async changeLimitType(data: IChangeLimitTypeRequest): Promise<AxiosResponse> {
        return $api.post('api/player/ChangeLimitType', data);
    }
}
