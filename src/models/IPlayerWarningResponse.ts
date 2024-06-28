export interface IPlayerWarningResponse {
    type: WarningType;
    message: string;
}

export enum WarningType {
    DiscordNotConnected,
}