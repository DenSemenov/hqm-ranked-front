import { IReplayMessage, IReplayPlayer, IReplayPuck, IReplayTick, PlayerInList } from "models/IReplayTick";
import { HQMMessageReader } from "./HQMMessageReader";
import HqmParse from "./HqmParse";
import { ReplayMessage, ReplayMessageType, ReplayPlayer, ReplayPuck, ReplayTeam, ReplayTick } from "models/IReplayViewerResponse";
import { IDictionary } from "models/IDictionary";

export default class ReplayParserService {
    static transformKeys = (obj: any[]) => {
        return obj.map((x, index) => {
            return {
                packetNumber: index,
                redScore: x.rs,
                blueScore: x.bs,
                time: x.t,
                period: x.p,
                pucks: x.pc.map((pc: any) => {
                    return {
                        index: pc.i,
                        posX: pc.x,
                        posY: pc.y,
                        posZ: pc.z,
                        rotX: pc.rx,
                        rotY: pc.ry,
                        rotZ: pc.rz,
                    } as ReplayPuck
                }),
                players: x.pl.map((pl: any) => {
                    return {
                        index: pl.i,
                        posX: pl.x,
                        posY: pl.y,
                        posZ: pl.z,
                        rotX: pl.rx,
                        rotY: pl.ry,
                        rotZ: pl.rz,
                        stickPosX: pl.spx,
                        stickPosY: pl.spy,
                        stickPosZ: pl.spz,
                        stickRotX: pl.srx,
                        stickRotY: pl.sry,
                        stickRotZ: pl.srz,
                        headTurn: pl.ht,
                        bodyLean: pl.bl
                    } as ReplayPlayer
                }),
                messages: x.m.map((m: any) => {
                    return {
                        replayMessageType: m.rmt,
                        objectIndex: m.oi,
                        playerIndex: m.pi,
                        message: m.m,
                        goalIndex: m.gi,
                        assistIndex: m.ai,
                        updatePlayerIndex: m.upi,
                        playerName: m.pn,
                        inServer: m.is,
                        team: m.t
                    } as ReplayMessage
                }),
                playersInList: x.pil.map((pil: any) => {
                    return {
                        index: pil.i,
                        name: pil.n,
                        team: pil.t
                    } as any
                }),
            } as ReplayTick
        })
    }

    static async parseHrpFile(data: Uint8Array) {
        let replayTicks: IReplayTick[] = [];

        const dataLen = data.length;

        let reader = new HQMMessageReader(data);

        reader.ReadU32Aligned();
        reader.ReadU32Aligned();

        let oldSavedPackets: IDictionary = {};
        let currentMsgPos = 0;
        let currentPlayerList: any[] = [];
        let packet = 0;

        while (reader.pos < dataLen) {
            reader.ReadByteAligned();
            reader.ReadBits(1);

            const redScore = reader.ReadBits(8);
            const blueScore = reader.ReadBits(8);
            const time = reader.ReadBits(16);
            reader.ReadBits(16);
            const period = reader.ReadBits(8);

            const { readerTemp, objects, current_packet_num, historyTemp } = ReplayParserService.ReadObjects(reader, oldSavedPackets);
            reader = readerTemp;
            oldSavedPackets = historyTemp;

            const messageNum = reader.ReadBits(16);
            const msgPos = reader.ReadBits(16);
            const messagesInThisPacket: any[] = [];

            for (let i = 0; i < messageNum; i++) {
                var msgPosOfThisMessage = msgPos + i;
                var msg = ReplayParserService.ReadMessage(reader);
                if (msg) {
                    reader = msg.reader;

                    if (msgPosOfThisMessage >= currentMsgPos) {
                        currentPlayerList = ReplayParserService.ProcessMessage(msg?.msg, currentPlayerList);
                        messagesInThisPacket.push(msg.msg);
                    }
                }
            }
            currentMsgPos = msgPos + messageNum;
            reader.Next();

            replayTicks = ReplayParserService.AddReplayTick(replayTicks, packet, redScore, blueScore, period, time, objects, currentPlayerList, messagesInThisPacket);

            packet += 1;
        }

        return replayTicks;
    }

    static AddReplayTick(replayTicks: IReplayTick[], packet: number, redScore: number, blueScore: number, period: number, time: number, objects: any[], currentPlayerList: any[], messagesInThisPacket: any[]) {
        let players = currentPlayerList.filter(player => player?.team_and_skater != null)
            .map(player => {
                return {
                    i: player.team_and_skater.oi,
                    t: player.team_and_skater.team,
                    n: player.name,
                    li: player.index
                } as PlayerInList
            });

        var replayMessages = messagesInThisPacket.map(message => {
            return {
                m: message.message,
                ai: message.assist_player_index,
                gi: message.goal_player_index,
                is: message.in_server,
                oi: message.objectItem?.oi,
                t: message.team,
                pi: message.player_index,
                pn: message.player_name,
                rmt: message.type,
                upi: message.player_index
            } as IReplayMessage
        })

        var pucks = objects.filter(x => x && !Object.hasOwn(x, 'stick_pos_x')).map(puck => {
            return {
                i: puck.index,
                x: puck.pos_x,
                y: puck.pos_y,
                z: puck.pos_z,
                rx: puck.rot_x,
                ry: puck.rot_y,
                rz: puck.rot_z
            } as IReplayPuck
        })

        var skaters = objects.filter(x => x && Object.hasOwn(x, 'stick_pos_x')).map(skater => {
            return {
                i: skater.index,
                x: skater.pos_x,
                y: skater.pos_y,
                z: skater.pos_z,
                rx: skater.rot_x,
                ry: skater.rot_y,
                rz: skater.rot_z,
                spx: skater.stick_pos_x,
                spy: skater.stick_pos_y,
                spz: skater.stick_pos_z,
                srx: skater.stick_rot_x,
                sry: skater.stick_rot_y,
                srz: skater.stick_rot_z,
                ht: skater.body_turn,
                bl: skater.body_lean
            } as IReplayPlayer
        })

        if (skaters.length > 0) {
            replayTicks.push({
                pn: packet,
                rs: redScore,
                bs: blueScore,
                p: period,
                t: time,
                pc: pucks,
                pl: skaters,
                pil: players,
                m: replayMessages
            } as IReplayTick);
        }

        return replayTicks;
    }


    static ProcessMessage(msg: any, currentPlayerList: any[]) {
        switch (msg.type) {
            case ReplayMessageType.PlayerUpdate:
                return ReplayParserService.UpdatePlayer(msg, currentPlayerList);
            case ReplayMessageType.Goal:
            case ReplayMessageType.Chat:
                return ReplayParserService.UpdateMessagePlayerName(msg, currentPlayerList);
            default:
                return currentPlayerList;
        }
    }

    static UpdateMessagePlayerName(msg: any, currentPlayerList: any[]) {
        var playerIndex = msg.player_index ?? msg.goal_player_index;
        if (playerIndex && playerIndex != -1) {
            var player = currentPlayerList.filter(x => x != null).find(x => x.index == playerIndex);
            msg.player_name = player?.name;
        }

        return currentPlayerList;
    }

    static UpdatePlayer(msg: any, currentPlayerList: any[]) {
        var playerIndex = msg.player_index;
        if (msg.in_server) {
            currentPlayerList[playerIndex] = {
                name: msg.player_name,
                team_and_skater: msg.objectItem,
                index: playerIndex
            };
        }
        else {
            currentPlayerList[playerIndex] = null;
        }

        return currentPlayerList;
    }


    static ReadMessage(reader: HQMMessageReader) {
        var messageType = reader.ReadBits(6);

        switch (messageType) {
            case 0:
                return ReplayParserService.ReadPlayerUpdateMessage(reader);
            case 1:
                return ReplayParserService.ReadGoalMessage(reader);
            case 2:
                return ReplayParserService.ReadChatMessage(reader);
            default:
                return null;
        }
    }

    static ReadChatMessage(reader: HQMMessageReader) {
        var playerIndex = reader.ReadBits(6);
        var size = reader.ReadBits(6);

        let bytes: number[] = [];
        for (let i = 0; i < size; i++) {
            bytes.push(reader.ReadBits(7));
        }
        var chatMessage = ReplayParserService.StringFromBinaryArray(bytes);

        return {
            reader: reader,
            msg: {
                type: ReplayMessageType.Chat,
                player_index: playerIndex != 0x3F ? playerIndex : -1,
                message: chatMessage
            }
        };
    }

    static ReadGoalMessage(reader: HQMMessageReader) {
        var team = reader.ReadBits(2) == 0 ? ReplayTeam.Red : ReplayTeam.Blue;
        var goalPlayerIndex = reader.ReadBits(6);
        var assistPlayerIndex = reader.ReadBits(6);

        return {
            reader: reader,
            msg: {
                team: team,
                type: ReplayMessageType.Goal,
                goal_player_index: goalPlayerIndex,
                assist_player_index: assistPlayerIndex
            }
        };
    }

    static ReadPlayerUpdateMessage(reader: HQMMessageReader) {
        var playerIndex = reader.ReadBits(6);
        var inServer = reader.ReadBits(1) == 1;
        let team: ReplayTeam = ReplayTeam.Spectator;

        var teamBits = reader.ReadBits(2);
        if (teamBits == 0)
            team = ReplayTeam.Red;
        else if (teamBits == 1)
            team = ReplayTeam.Blue;

        var oi = reader.ReadBits(6);
        var objectIndex = oi !== 0x3F ? { oi, team } : null

        let bytes: number[] = [];
        for (let i = 0; i < 31; i++) {
            bytes.push(reader.ReadBits(7));
        }
        var playerName = bytes;
        return {
            reader: reader,
            msg: {
                type: ReplayMessageType.PlayerUpdate,
                player_name: ReplayParserService.StringFromBinaryArray(playerName),
                objectItem: objectIndex,
                player_index: playerIndex,
                in_server: inServer
            }
        };
    }

    static StringFromBinaryArray(bytes: number[]) {
        const decoder = new TextDecoder('utf-8');
        return decoder.decode(new Uint8Array(bytes)).trim().replaceAll("\u0000", "");
    }



    static ReadObjects(reader: HQMMessageReader, history: IDictionary) {
        const current_packet_num = reader.ReadU32Aligned();
        const previous_packet_num = reader.ReadU32Aligned();
        let find_old: any = null;
        if (previous_packet_num in history) {
            find_old = history[previous_packet_num];
        }

        const packets: any[] = [];

        for (let i = 0; i < 32; i++) {
            const is_object = reader.ReadBits(1) == 1;
            let packet: any = null;
            if (is_object) {
                let old_object_in_this_slot = find_old ? find_old[i] : null;
                const object_type = reader.ReadBits(2);
                if (object_type == 0) {
                    const old_skater = old_object_in_this_slot ?? null;
                    var x = reader.ReadPos(17, old_skater?.pos.x);
                    var y = reader.ReadPos(17, old_skater?.pos.y);
                    var z = reader.ReadPos(17, old_skater?.pos.z);

                    var r1 = reader.ReadPos(31, old_skater?.rot.r1);
                    var r2 = reader.ReadPos(31, old_skater?.rot.r2);

                    var stick_x = reader.ReadPos(13, old_skater?.stick_pos.stick_x);
                    var stick_y = reader.ReadPos(13, old_skater?.stick_pos.stick_y);
                    var stick_z = reader.ReadPos(13, old_skater?.stick_pos.stick_z);

                    var stick_r1 = reader.ReadPos(25, old_skater?.stick_rot.stick_r1);
                    var stick_r2 = reader.ReadPos(25, old_skater?.stick_rot.stick_r2);

                    var body_turn = reader.ReadPos(16, old_skater?.body_turn);
                    var body_lean = reader.ReadPos(16, old_skater?.body_lean);

                    packet = {
                        pos: {
                            x, y, z
                        },
                        rot: { r1, r2 },
                        stick_pos: { stick_x, stick_y, stick_z },
                        stick_rot: { stick_r1, stick_r2 },
                        body_turn: body_turn,
                        body_lean: body_lean
                    };
                }
                else if (object_type == 1) {
                    const old_puck = old_object_in_this_slot ?? null;
                    var x = reader.ReadPos(17, old_puck?.pos.x);
                    var y = reader.ReadPos(17, old_puck?.pos.y);
                    var z = reader.ReadPos(17, old_puck?.pos.z);
                    var r1 = reader.ReadPos(31, old_puck?.rot.r1);
                    var r2 = reader.ReadPos(31, old_puck?.rot.r2);
                    packet =
                    {
                        pos: { x, y, z },
                        rot: { r1, r2 }
                    };
                }
            }
            packets.push(packet);
        }

        const objects: any[] = [];
        let index = 0;

        packets.forEach(packet => {
            if (packet) {
                if (Object.hasOwn(packet, 'stick_pos')) {
                    const pos_x_p = packet.pos.x / 1024.0;
                    const pos_y_p = packet.pos.y / 1024.0;
                    const pos_z_p = packet.pos.z / 1024.0;
                    const stick_pos_x = (packet.stick_pos.stick_x / 1024.0) + pos_x_p - 4.0;
                    const stick_pos_y = (packet.stick_pos.stick_y / 1024.0) + pos_y_p - 4.0;
                    const stick_pos_z = (packet.stick_pos.stick_z / 1024.0) + pos_z_p - 4.0;

                    var stick_rot_p = HqmParse.ConvertMatrixFromNetwork(31, packet.stick_rot.stick_r1, packet.stick_rot.stick_r2);
                    var stick_rot_x = stick_rot_p.x;
                    var stick_rot_y = stick_rot_p.y;
                    var stick_rot_z = stick_rot_p.z;
                    var rot_p = HqmParse.ConvertMatrixFromNetwork(31, packet.rot.r1, packet.rot.r2);
                    var rot_x_p = rot_p.x;
                    var rot_y_p = rot_p.y;
                    var rot_z_p = rot_p.z;

                    objects.push({
                        index: index,
                        pos_x: 30 - pos_x_p,
                        pos_y: pos_y_p,
                        pos_z: pos_z_p,
                        rot_x: rot_x_p,
                        rot_y: rot_y_p,
                        rot_z: rot_z_p,
                        stick_pos_x: 30 - stick_pos_x,
                        stick_pos_y: stick_pos_y,
                        stick_pos_z: stick_pos_z,
                        stick_rot_x: stick_rot_x,
                        stick_rot_y: stick_rot_y,
                        stick_rot_z: stick_rot_z,
                        body_turn: (packet.body_turn - 16384.0) / 8192.0,
                        body_lean: (packet.body_lean - 16384.0) / 8192.0
                    });
                } else {
                    const pos_x = packet.pos.x / 1024.0;
                    const pos_y = packet.pos.y / 1024.0;
                    const pos_z = packet.pos.z / 1024.0;

                    var rot = HqmParse.ConvertMatrixFromNetwork(31, packet.rot.r1, packet.rot.r2);
                    var rot_x = rot.x;
                    var rot_y = rot.y;
                    var rot_z = rot.z;
                    objects.push({
                        index,
                        pos_x: 30 - pos_x,
                        pos_y: pos_y,
                        pos_z: pos_z,
                        rot_x: rot_x,
                        rot_y: rot_y,
                        rot_z: rot_z
                    });
                }
            }

            index += 1;
        })

        history[current_packet_num] = packets;
        return { objects, current_packet_num, readerTemp: reader, historyTemp: history };
    }
}
