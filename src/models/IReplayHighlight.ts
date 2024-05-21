export interface IReplayHighlight {
    id: string;
    type: HighlightType;
    packet: number;
    name: string;
}

export enum HighlightType {
    Shot,
    Save
}