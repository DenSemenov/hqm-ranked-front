import { Position } from "./ITransferMarketRequest";

export interface ITransferMarketResponse {
    id: string;
    teamId: string;
    teamName: string;
    date: Date;
    positions: Position[]
    budget: number;
    askedToJoin: ITransferMarketAskResponse[]
}

export interface ITransferMarketAskResponse {
    id: number;
    name: string;
    positions: Position[]
    cost: number;
}
