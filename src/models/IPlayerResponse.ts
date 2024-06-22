import { IGamePlayerResponse } from "./IGameResponse";
import { IInstanceType } from "./IInstanceType";

export interface IPlayerResponse {
    id: number;
    name: string;
    games: number;
    goals: number;
    assists: number;
    points: number;
    cost: number;
    currentSeasonData: PlayerLastSeasonViewModel;
    lastGames: PlayerLastGamesViewModel[];
    lastSeasons: PlayerSeasonsViewModel[];
    calcData: PlayerCalcDataViewModel;
    oldNicknames: string[];
}

export interface PlayerLastSeasonViewModel {
    position: number;
    games: number;
    goals: number;
    assists: number;
    points: number;
    elo: number;
}

export interface PlayerSeasonsViewModel {
    name: string;
    place: number;
}

export interface PlayerLastGamesViewModel {
    gameId: string;
    redScore: number;
    blueScore: number;
    date: Date;
    goals: number;
    assists: number;
    score: number;
    players: IGamePlayerResponse[]
    redTeamId?: string;
    redTeamName?: string;
    blueTeamId?: string;
    blueTeamName?: string;
    instanceType: IInstanceType;
}

export interface PlayerCalcDataViewModel {
    shots: number;
    dribbling: number;
    passes: number;
    longShots: number;
    tackling: number;
    pressing: number;
    blocks: number;
    interception: number;
    highBlocks: number;
    lowBlocks: number;
    oneByOne: number;
    gateLeaving: number;
}