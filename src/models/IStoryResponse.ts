import { IInstanceType } from "./IInstanceType";

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
    music: IStoryGoalMusicResponse;
    instanceType: IInstanceType
    url: string;
}

export interface IStoryGoalMusicResponse {
    id: string;
    imageUrl: string;
    name: string;
    title: string;
    url: string;
}

export interface IStoryLikeResponse {
    id: number;
    name: string;
}