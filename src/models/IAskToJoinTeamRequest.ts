import { Position } from "./ITransferMarketRequest";

export interface IAskToJoinTeamRequest {
    id: string;
    positions: Position[];
}