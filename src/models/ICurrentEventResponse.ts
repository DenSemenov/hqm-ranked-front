export interface ICurrentEventResponse {
    id: string;
    text: string;
    players: ICurrentEventPlayerResponse[];
    left: string;
}

export interface ICurrentEventPlayerResponse {
    id: number;
    name: string;
}