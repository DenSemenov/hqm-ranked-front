export interface ISeasonGameResponse {
    gameId: string;
    date: Date;
    redScore: number;
    blueScore: number;
    status: string;
    players: IGamePlayerItem[];
}

export interface IGamePlayerItem {
    id: number;
    name: string;
    team: number;
}