import { IInstanceType } from "./IInstanceType";

export interface IActiveServerResponse {
    id: string;
    name: string;
    loggedIn: number;
    teamMax: number;
    period: number;
    time: number;
    redScore: number;
    blueScore: number;
    state: number;
    instanceType: IInstanceType
}