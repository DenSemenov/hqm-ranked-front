export interface IGameInviteResponse {
    id: string;
    isCurrentTeam: boolean;
    date: Date;
    votes: IGameInviteVoteResponse[]
}

export interface IGameInviteVoteResponse {
    id: number;
}