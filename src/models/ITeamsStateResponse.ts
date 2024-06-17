import { IBudgetType } from "./IBudgetType";

export interface ITeamsStateResponse {
    canCreateTeam: boolean;
    isCaptain: boolean;
    isAssistant: boolean;
    captainId?: number;
    assistantId?: number;
    teamsMaxPlayers: number;
    team?: ITeamsStateCurrentTeamResponse;

}

export interface ITeamsStateCurrentTeamResponse {
    id: string;
    name: string;
    budget: number;
    budgetHistory: ITeamsStateCurrentTeamBudgetHistoryResponse[]
    players: ITeamsStateCurrentPlayerResponse[];
}

export interface ITeamsStateCurrentPlayerResponse {
    id: number;
    name: string;
    cost: number;
}

export interface ITeamsStateCurrentTeamBudgetHistoryResponse {
    date: Date;
    change: number;
    type: IBudgetType;
    invitedPlayerId?: number;
    invitedPlayerNickname?: string;

}
