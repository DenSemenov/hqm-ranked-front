import { ICancelPlayerInviteRequest } from "models/ICancelPlayerInviteRequest";
import $api from "../http";
import { AxiosResponse } from 'axios'
import { ICreateTeamRequest } from "models/ICreateTeamRequest";
import { IFreeAgentResponse } from "models/IFreeAgentResponse";
import { IInvitePlayerRequest } from "models/IInvitePlayerRequest";
import { ITeamsStateResponse } from "models/ITeamsStateResponse";
import { IPlayerInviteResponse } from "models/IPlayerInviteResponse";
import { IGetTeamRequest } from "models/IGetTeamRequest";
import { ITeamResponse } from "models/ITeamResponse";
import { ISellPlayerRequest } from "models/ISellPlayerRequest";
import { IMakeCapOrAssistantRequest } from "models/IMakeCapOrAssistantRequest";
import { ICreateGameInviteRequest } from "models/ICreateGameInviteRequest";
import { IGameInviteResponse } from "models/IGameInviteResponse";
import { IRemoveGameInviteRequest } from "models/IRemoveGameInviteRequest";
import { IVoteGameInviteRequest } from "models/IVoteGameInviteRequest";
import { ICurrentSeasonStatsRequest } from "models/ICurrentSeasonStatsRequest";
import { ITeamsStatsResponse } from "models/ITeamsStatsResponse";

export default class TeamsService {
    static async getTeamsState(): Promise<AxiosResponse<ITeamsStateResponse>> {
        return $api.post<ITeamsStateResponse>('api/teams/GetTeamsState');
    }
    static async createTeam(data: ICreateTeamRequest): Promise<AxiosResponse> {
        return $api.post('api/teams/CreateTeam', data);
    }
    static async leaveTeam(): Promise<AxiosResponse> {
        return $api.post('api/teams/LeaveTeam');
    }
    static async getFreeAgents(): Promise<AxiosResponse<IFreeAgentResponse[]>> {
        return $api.post<IFreeAgentResponse[]>('api/teams/GetFreeAgents');
    }
    static async invitePlayer(data: IInvitePlayerRequest): Promise<AxiosResponse> {
        return $api.post('api/teams/InvitePlayer', data);
    }
    static async cancelInvite(data: ICancelPlayerInviteRequest): Promise<AxiosResponse> {
        return $api.post('api/teams/CancelInvite', data);
    }
    static async getInvites(): Promise<AxiosResponse<IPlayerInviteResponse[]>> {
        return $api.post<IPlayerInviteResponse[]>('api/teams/GetInvites');
    }
    static async applyPlayerInvite(data: ICancelPlayerInviteRequest): Promise<AxiosResponse> {
        return $api.post('api/teams/ApplyPlayerInvite', data);
    }
    static async declinePlayerInvite(data: ICancelPlayerInviteRequest): Promise<AxiosResponse> {
        return $api.post('api/teams/DeclinePlayerInvite', data);
    }
    static async getTeam(data: IGetTeamRequest): Promise<AxiosResponse<ITeamResponse>> {
        return $api.post<ITeamResponse>('api/teams/GetTeam', data);
    }
    static async sellPlayer(data: ISellPlayerRequest): Promise<AxiosResponse> {
        return $api.post('api/teams/SellPlayer', data);
    }
    static async makeCaptain(data: IMakeCapOrAssistantRequest): Promise<AxiosResponse> {
        return $api.post('api/teams/MakeCaptain', data);
    }
    static async makeAssistant(data: ISellPlayerRequest): Promise<AxiosResponse> {
        return $api.post('api/teams/MakeAssistant', data);
    }
    static async createGameInvite(data: ICreateGameInviteRequest): Promise<AxiosResponse<string>> {
        return $api.post<string>('api/teams/CreateGameInvite', data);
    }
    static async removeGameInvite(data: IRemoveGameInviteRequest): Promise<AxiosResponse<string>> {
        return $api.post<string>('api/teams/RemoveGameInvite', data);
    }
    static async getGameInvites(): Promise<AxiosResponse<IGameInviteResponse[]>> {
        return $api.post<IGameInviteResponse[]>('api/teams/GetGameInvites');
    }
    static async voteGameInvite(data: IVoteGameInviteRequest): Promise<AxiosResponse> {
        return $api.post('api/teams/VoteGameInvite', data);
    }
    static async getTeamsStats(data: ICurrentSeasonStatsRequest): Promise<AxiosResponse<ITeamsStatsResponse[]>> {
        return $api.post<ITeamsStatsResponse[]>('api/teams/GetTeamsStats', data);
    }
}