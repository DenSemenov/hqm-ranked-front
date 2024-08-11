import { ReplayTeam } from "./IReplayViewerResponse";


export interface ReplayCalculatedData {
    chats: ReplayCalculatedChat[];
    goals: ReplayCalculatedGoal[];
    possession: ReplayCalculatedPossession[];
    shots: ReplayCalculatedShot[];
    saves: ReplayCalculatedSave[];
    goalies: ReplayCalculatedGoaliePosition[];
    pauses: ReplayCalculatedPause[];
}

export interface ReplayCalculatedChat {
    packet: number;
    text: string;
}

export interface ReplayCalculatedGoal {
    packet: number;
    goalBy: string;
    period: number;
    time: number;
}

export interface ReplayCalculatedPossession {
    name: string;
    touches: number;
}

export interface ReplayCalculatedShot {
    packet: number;
    name: string;
}

export interface ReplayCalculatedSave {
    packet: number;
    name: string;
}

export interface ReplayCalculatedGoaliePosition {
    startPacket: number;
    endPacket: number;
    team: ReplayTeam;
    name: string;
}

export interface ReplayCalculatedPause {
    startPacket: number;
    endPacket: number;
}