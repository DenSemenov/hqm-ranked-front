export interface IGameInviteResponse {
    id: string;
    isCurrentTeam: boolean;
    date: Date;
    votes: IGameInviteVoteResponse[]
    gamesCount: number;
}

export interface IGameInviteVoteResponse {
    id: number;
}