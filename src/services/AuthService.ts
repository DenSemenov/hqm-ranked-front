import { ICurrentUserRequest } from "models/ICurrentUserRequest";
import $api from "../http";
import { IAuthResponse } from "../models/IAuthResponse";
import { ILoginRequest } from "../models/ILoginRequest";
import { AxiosResponse } from 'axios'
import { ICurrentUserResponse } from "models/ICurrentUserResponse";
import { IChangePasswordRequest } from "models/IChangePasswordRequest";

export default class AuthService {
    static async login(data: ILoginRequest): Promise<AxiosResponse<IAuthResponse>> {
        return $api.post<IAuthResponse>('api/player/login', data);
    }

    static async getCurrentUser(): Promise<AxiosResponse<ICurrentUserResponse>> {
        return $api.post<ICurrentUserResponse>('api/player/GetCurrentUser');
    }

    static async changePassword(data: IChangePasswordRequest): Promise<AxiosResponse> {
        return $api.post('api/player/ChangePassword', data);
    }
}
