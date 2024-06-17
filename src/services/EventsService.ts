import { ICurrentEventResponse } from "models/ICurrentEventResponse";
import $api from "../http";
import { AxiosResponse } from 'axios'

export default class EventsService {
    static async getCurrentEvent(): Promise<AxiosResponse<ICurrentEventResponse>> {
        return $api.post<ICurrentEventResponse>('api/events/GetCurrentEvent');
    }
}