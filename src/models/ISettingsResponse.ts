export interface ISettingsResponse {
    nicknameChangeDaysLimit: number;
    newPlayerApproveRequired: boolean;
    rules: string;
    replayStoreDays: boolean;
    discordNotificationWebhook: string;
    webhookCount: number;
    nextGameCheckGames: number;
    shadowBanReportsCount: number;
    startingElo: number;
}