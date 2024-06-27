export interface IReplayViewerResponse {
    index: number;
    gameId: string;
    fragments: IFragment[];
    data: ReplayTick[];
    url: string;
}

export interface IFragment {
    index: number;
    min: number;
    max: number;
}

export interface ReplayTick {
    packetNumber: number;
    gameOver: boolean;
    redScore: number;
    blueScore: number;
    time: number;
    goalMessageTimer: number;
    period: number;
    pucks: ReplayPuck[];
    players: ReplayPlayer[];
    messages: ReplayMessage[];
    playersInList: PlayerInList[];
}

export interface PlayerInList {
    index: number;
    name: string;
    team: ReplayTeam;
}

export interface ReplayPuck {
    index: number;
    posX: number;
    posY: number;
    posZ: number;
    rotX: number;
    rotY: number;
    rotZ: number;
}

export interface ReplayPlayer {
    index: number;
    posX: number;
    posY: number;
    posZ: number;
    rotX: number;
    rotY: number;
    rotZ: number;
    stickPosX: number;
    stickPosY: number;
    stickPosZ: number;
    stickRotX: number;
    stickRotY: number;
    stickRotZ: number;
    headTurn: number;
    bodyLean: number;
}

export interface ReplayMessage {
    replayMessageType: ReplayMessageType;
    objectIndex: number;
    playerIndex: number;
    message: string;
    goalIndex: number;
    assistIndex: number;
    updatePlayerIndex: number;
    playerName: string;
    inServer: boolean;
    team: ReplayTeam;
}

export enum ReplayMessageType {
    Chat,
    Goal,
    PlayerUpdate
}

export enum ReplayTeam {
    Red,
    Blue,
    Spectator
}