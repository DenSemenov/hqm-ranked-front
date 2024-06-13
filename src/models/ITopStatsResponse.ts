export interface ITopStatsResponse {
    id: number;
    name: string;
    gp: number;
    goals: number;
    assists: number;
    wins: number;
    loses: number;
    goalsPerGame: number;
    assistsPerGame: number;
    winrate: number;
    cost: number;
    elo: number;
}