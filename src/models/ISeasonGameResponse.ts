export interface ISeasonGameResponse {
    gameId: string;
    date: Date;
    redScore: number;
    blueScore: number;
    status: string;
    teamNameRed: string;
    teamNameBlue: string;
    teamRedId: number;
    teamBlueId: number;
}