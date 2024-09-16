import { AxiosResponse } from "axios";
import $api from "../http";
import { IWeelkyTourneyResponse } from "models/IWeelkyTourneyResponse";
import { IWeeklyTourneyIdRequest } from "models/IWeeklyTourneyIdRequest";
import { IWeeklyTourneyItemResponse } from "models/IWeeklyTourneyItemResponse";

export default class WeeklyTourneyService {
    static async getCurrentWeeklyTourneyId(): Promise<AxiosResponse<string | undefined>> {
        return $api.post<string | undefined>('api/weeklyTourney/GetCurrentWeeklyTourneyId');
    }
    static async getWeeklyTourney(data: IWeeklyTourneyIdRequest): Promise<AxiosResponse<IWeelkyTourneyResponse>> {
        return $api.post<IWeelkyTourneyResponse>('api/weeklyTourney/GetWeeklyTournament', data);
    }
    static async getWeeklyTourneys(): Promise<AxiosResponse<IWeeklyTourneyItemResponse[]>> {
        return $api.post<IWeeklyTourneyItemResponse[]>('api/weeklyTourney/GetWeeklyTourneys');
    }
    static async weeklyTourneyRegister(): Promise<AxiosResponse> {
        return $api.post('api/weeklyTourney/WeeklyTourneyRegister');
    }
}