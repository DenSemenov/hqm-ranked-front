export interface IContractResponse {
    contractType: ContractType;
    count: number;
    points: number;
    canSelect: boolean;
}

export enum ContractType {
    Assists,
    WinWith800Elo,
    Saves,
    WinWith20Possesion,
    Winstreak,
    RiseInRanking
}