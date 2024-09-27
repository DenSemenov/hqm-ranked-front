export interface ISettingsResponse {
    nicknameChangeDaysLimit: number;
    newPlayerApproveRequired: boolean;
    rules: string;
    replayStoreDays: number;
    nextGameCheckGames: number;
    discordNotificationWebhook: string;
    webhookCount: number;
    shadowBanReportsCount: number;
    startingElo: number;
    s3Domain: string;
    s3Bucket: string;
    s3User: string;
    s3Key: string;
    pushJson: string;
    spotifyClientId: string;
    spotifySecret: string;
    spotifyPlaylist: string;
    teamsMaxPlayer: number;
    discordAppClientId: number;
    discordApprove: boolean;
    webUrl: string;
}