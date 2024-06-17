import { IBudgetType } from "./IBudgetType";

export interface ITeamResponse {
    id: string;
    name: string;
    captainId?: number;
    assistantId?: number;
    players: ITeamPlayerResponse[]
    budgetHistory: ITeamBudgetHistoryItemResponse[];
    games: number;
    goals: number;
}

export interface ITeamPlayerResponse {
    id: number;
    name: string;
}

export interface ITeamBudgetHistoryItemResponse {
    date: Date;
    change: number;
    type: IBudgetType;
    invitedPlayerId?: number;
    invitedPlayerNickname?: string;
}