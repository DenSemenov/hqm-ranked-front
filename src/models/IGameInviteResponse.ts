export interface IGameInviteResponse {
    id: string;
    isCurrentTeam: boolean;
    date: Date;
    votes: IGameInviteVoteResponse[]
    gamesCount: number;
    otherTeams: IGameInviteAnotherTeamResponse[]
}

export interface IGameInviteVoteResponse {
    id: number;
}

export interface IGameInviteAnotherTeamResponse {
    name: string;
    votes: number;
}