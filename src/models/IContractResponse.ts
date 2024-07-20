export interface IContractResponse {
    id: string;
    contractType: ContractType;
    count: number;
    points: number;
    isSelected: boolean;
    isHidden: boolean;
    isPassed: boolean;
    selectedDate: Date;
    currentCount: number;

}

export enum ContractType {
    Assists,
    WinWith800Elo,
    Saves,
    WinWith20Possesion,
    Winstreak,
    RiseInRanking
}