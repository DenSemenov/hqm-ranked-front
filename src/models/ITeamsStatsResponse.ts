export interface ITeamsStatsResponse {
    teams: ITeamsStatsTeamResponse[];
    players: ITeamsStatsPlayerResponse[];
}

export interface ITeamsStatsTeamResponse {
    place: number;
    id: string;
    name: string;
    win: number;
    lose: number;
    goals: number;
    goalsConceded: number;
    rating: number;
}

export interface ITeamsStatsPlayerResponse {
    place: number;
    playerId: number;
    nickname: string;
    win: number;
    lose: number;
    goals: number;
    assists: number;
    mvp: number;
    rating: number;
}

