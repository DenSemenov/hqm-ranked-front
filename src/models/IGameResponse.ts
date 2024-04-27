export interface IGameResponse {
    id: string;
    state: string;
    date: Date;
    redScore: number;
    blueScore: number;
    players: IGamePlayerResponse[]
}

export interface IGamePlayerResponse {
    id: number;
    name: string;
    goals: number;
    assists: number;
    score: number;
    team: number;
}