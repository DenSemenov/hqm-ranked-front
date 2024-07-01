export interface ITransferMarketRequest {
    positions: Position[];
    budget: number;
}

export enum Position {
    Gk,
    Def,
    Fwd
}