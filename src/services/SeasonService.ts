import $api from "../http";
import { AxiosResponse } from 'axios'
import { IAdminStoryResponse } from "models/IAdminStoryResponse";
import { ICurrentSeasonStatsRequest } from "models/ICurrentSeasonStatsRequest";
import { IGameRequest } from "models/IGameRequest";
import { IGameResponse } from "models/IGameResponse";
import { IPlayerRequest } from "models/IPlayerRequest";
import { IPlayerResponse } from "models/IPlayerResponse";
import { IReplayChatMessage } from "models/IReplayChatMessage";
import { IReplayGoalResponse } from "models/IReplayGoalResponse";
import { IReplayHighlight } from "models/IReplayHighlight";
import { IReplayRequest } from "models/IReplayRequest";
import { IReplayViewerRequest } from "models/IReplayViewerRequest";
import { IReplayViewerResponse } from "models/IReplayViewerResponse";
import { IRulesResponse } from "models/IRulesResponse";
import { ISeasonGameResponse } from "models/ISeasonGameResponse";
import { ISeasonResponse } from "models/ISeasonResponse";
import { ISeasonStatsResponse } from "models/ISeasonStatsResponse";
import { IStoryLikeRequest } from "models/IStoryLikeRequest";
import { IStoryReplayViewerRequest } from "models/IStoryReplayViewerRequest";
import { IStoryResponse } from "models/IStoryResponse";
import { ITopStatsResponse } from "models/ITopStatsResponse";

export default class SeasonService {
    static async getSeasons(): Promise<AxiosResponse<ISeasonResponse[]>> {
        return $api.post<ISeasonResponse[]>('api/seasons/GetSeasons');
    }
    static async getSeasonsStats(data: ICurrentSeasonStatsRequest): Promise<AxiosResponse<ISeasonStatsResponse[]>> {
        return $api.post<ISeasonStatsResponse[]>('api/seasons/GetSeasonStats', data);
    }
    static async getSeasonsGames(data: ICurrentSeasonStatsRequest): Promise<AxiosResponse<ISeasonGameResponse[]>> {
        return $api.post<ISeasonGameResponse[]>('api/seasons/GetSeasonGames', data);
    }
    static async getPlayerData(data: IPlayerRequest): Promise<AxiosResponse<IPlayerResponse>> {
        return $api.post<IPlayerResponse>('api/seasons/GetPlayerData', data);
    }
    static async getGameData(data: IGameRequest): Promise<AxiosResponse<IGameResponse>> {
        return $api.post<IGameResponse>('api/seasons/GetGameData', data);
    }
    static async getRules(): Promise<AxiosResponse<IRulesResponse>> {
        return $api.post<IRulesResponse>('api/seasons/GetRules');
    }
    static async getReplay(data: IReplayRequest): Promise<AxiosResponse<any>> {
        return $api.post<any>('api/replay/GetReplayData', data);
    }
    static async getReplayViewer(data: IReplayViewerRequest): Promise<AxiosResponse<any>> {
        return $api.post<IReplayViewerResponse>('api/replay/GetReplayViewer', data);
    }
    static async getReplayGoals(data: IReplayRequest): Promise<AxiosResponse<any>> {
        return $api.post<IReplayGoalResponse[]>('api/replay/GetReplayGoals', data);
    }
    static async getReplayChatMessages(data: IReplayRequest): Promise<AxiosResponse<any>> {
        return $api.post<IReplayChatMessage[]>('api/replay/GetReplayChatMessages', data);
    }
    static async getReplayHighlights(data: IReplayRequest): Promise<AxiosResponse<any>> {
        return $api.post<IReplayHighlight[]>('api/replay/GetReplayHighlights', data);
    }
    static async getStorage(): Promise<AxiosResponse<any>> {
        return $api.post<string>('api/seasons/GetStorage');
    }
    static async getStories(): Promise<AxiosResponse<any>> {
        return $api.post<IStoryResponse[]>('api/replay/GetReplayStories');
    }
    static async getMainStories(): Promise<AxiosResponse<IAdminStoryResponse[]>> {
        return $api.post<IAdminStoryResponse[]>('api/seasons/GetMainStories');
    }
    static async getStoryReplayViewer(data: IStoryReplayViewerRequest): Promise<AxiosResponse<any>> {
        return $api.post<IReplayViewerResponse>('api/replay/GetStoryReplayViewer', data);
    }
    static async likeStory(data: IStoryLikeRequest): Promise<AxiosResponse<any>> {
        return $api.post('api/replay/LikeStory', data);
    }
    static async getTopStats(): Promise<AxiosResponse<ITopStatsResponse[]>> {
        return $api.post<ITopStatsResponse[]>('api/seasons/GetTopStats');
    }
}
