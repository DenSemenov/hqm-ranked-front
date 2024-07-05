export interface IAdminPlayerResponse {
    id: number;
    name: string;
    isBanned: boolean;
    logins: IAdminPlayerLoginResponse[];
}

export interface IAdminPlayerLoginResponse {
    date: Date;
    city: string;
    countryCode: string;
    ip: string;
    loginInstance: LoginInstance
}

export enum LoginInstance {
    Web,
    Server
}