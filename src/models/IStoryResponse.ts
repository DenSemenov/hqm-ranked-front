export interface IStoryResponse {
    playerId: number;
    name: string;
    goals: IStoryGoalResponse[]
}

export interface IStoryGoalResponse {
    id: string;
    date: Date;
    replayId: string;
    packet: number;
    likes: IStoryLikeResponse[]
}

export interface IStoryLikeResponse {
    id: number;
    name: string;
}