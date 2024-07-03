export interface ICurrentEventResponse {
    id: string;
    text: string;
    players: ICurrentEventPlayerResponse[];
    left: string;
    value: number;
}

export interface ICurrentEventPlayerResponse {
    id: number;
    name: string;
    currentValue: number;
}