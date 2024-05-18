export interface IPlayerNotificationsResponse {
    token: string;
    logsCount: number;
    gameStarted: NotifyType;
    gameEnded: NotifyType;
}

export enum NotifyType {
    None = 0,
    On = 1,
    OnWithMe = 2
}
