export interface IReplayTick {
    pn: number;
    rs: number;
    bs: number;
    t: number;
    p: number;
    pc: IReplayPuck[];
    pl: IReplayPlayer[];
    m: IReplayMessage[];
    pil: PlayerInList[];
}

export interface IReplayPuck {
    i: number;
    x: number;
    y: number;
    z: number;
    rx: number;
    ry: number;
    rz: number;
}

export interface IReplayPlayer {
    i: number;
    x: number;
    y: number;
    z: number;
    rx: number;
    ry: number;
    rz: number;
    spx: number;
    spy: number;
    spz: number;
    srx: number;
    sry: number;
    srz: number;
    ht: number;
    bl: number;
    tm: ReplayTeam;
}

export interface IReplayMessage {
    rmt: ReplayMessageType;
    oi: number | null;
    pi: number | null;
    m: string | null;
    gi: number | null;
    ai: number | null;
    upi: number | null;
    pn: string;
    is: boolean;
    t: ReplayTeam;
}

export interface PlayerInList {
    li: number | null;
    i: number;
    n: string;
    t: ReplayTeam;
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

export interface HQMObject {
    t: number;
    i: number;
    px: number;
    py: number;
    pz: number;
    rx: number;
    ry: number;
    rz: number;
}

export interface HQMSkater extends HQMObject {
    spx: number;
    spy: number;
    spz: number;
    srx: number;
    sry: number;
    srz: number;
    bt: number;
    bl: number;
}

export interface HQMPuck extends HQMObject {

}