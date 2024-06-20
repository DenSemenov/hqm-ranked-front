import { IInstanceType } from "./IInstanceType";

export interface ISeasonGameResponse {
    gameId: string;
    date: Date;
    redScore: number;
    blueScore: number;
    status: string;
    hasReplayFragments: boolean;
    replayId: string;
    players: IGamePlayerItem[];
    instanceType: IInstanceType;
    redTeamId?: string;
    blueTeamId?: string;
    redTeamName?: string;
    blueTeamName?: string;
}

export interface IGamePlayerItem {
    id: number;
    name: string;
    team: number;
}