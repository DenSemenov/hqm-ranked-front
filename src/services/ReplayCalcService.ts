import { ReplayCalculatedData } from "models/IReplayCalculatedData";
import { IReplayTick } from "models/IReplayTick";
import { ReplayMessageType, ReplayPlayer, ReplayPuck, ReplayTeam, ReplayTick } from "models/IReplayViewerResponse";
import Vector3D from "shared/LinearAlgebra/Vector3D";

export default class ReplayCalcService {
    static GetReplayCalcData(ticks: ReplayTick[]) {
        const result: ReplayCalculatedData = {
            chats: [],
            goals: [],
            possession: [],
            shots: [],
            saves: [],
            goalies: [],
            pauses: []
        }

        result.goals = ticks.flatMap(x => x.messages.map(m => { return { packet: x.packetNumber, message: m, period: x.period, time: x.time } })).filter(x => x.message.replayMessageType === ReplayMessageType.Goal).map(x => {
            return {
                goalBy: x.message.playerName,
                packet: x.packet,
                period: x.period,
                time: x.time
            }
        })

        var withVectors: any[] = [];

        let prevTick: any = null;
        let prevTime = ticks[0].time;
        let prevPeriod = ticks[0].period;
        let pauseStartPacket: any = null;
        var j = 0;
        ticks.forEach(tick => {
            var packet: any = {
                packet: 0,
                objects: []
            };
            packet.packet = tick.packetNumber;

            tick.players.forEach(player => {
                let oldObject: any = null;

                if (prevTick) {
                    oldObject = prevTick.players.find((x: ReplayPlayer) => x.index === player.index);
                }

                var pos = new Vector3D(player.posX, player.posY, player.posZ);
                var rot = new Vector3D(player.rotX, player.rotY, player.rotZ);
                var stickPos = new Vector3D(player.stickPosX, player.stickPosY, player.stickPosZ);
                var stickRot = new Vector3D(player.stickRotX, player.stickRotY, player.stickRotZ);

                packet.objects.push({
                    type: 0,
                    index: player.index,
                    pos: pos,
                    rot: rot,
                    stickPos: stickPos,
                    stickRot: stickRot,
                    posVelocity: Vector3D.CalcVector(oldObject != null ? new Vector3D(oldObject.posX, oldObject.posY, oldObject.posZ) : null, pos),
                    rotVelocity: Vector3D.CalcVector(oldObject != null ? new Vector3D(oldObject.rotX, oldObject.rotY, oldObject.rotZ) : null, rot),
                    stickPosVelocity: Vector3D.CalcVector(oldObject != null ? new Vector3D(oldObject.stickPosX, oldObject.stickPosY, oldObject.stickPosZ) : null, stickPos),
                    stickRotVelocity: Vector3D.CalcVector(oldObject != null ? new Vector3D(oldObject.stickRotX, oldObject.stickRotY, oldObject.stickRotZ) : null, stickRot),
                })
            });

            tick.pucks.forEach(puck => {
                let oldObject: any = null;

                if (prevTick) {
                    oldObject = prevTick.pucks.find((x: ReplayPuck) => x.index === puck.index);
                }

                var pos = new Vector3D(puck.posX, puck.posY, puck.posZ);
                var rot = new Vector3D(puck.rotX, puck.rotY, puck.rotZ);

                let lastTouched: any = null;

                packet.objects.filter((x: any) => x.type === 0).forEach((player: any) => {
                    var p = Vector3D.Subtract(player.stickPos, pos);
                    var m = Vector3D.Magnitude(p);
                    if (m < 0.25) {
                        lastTouched = player.index;
                    }
                })

                packet.objects.push({
                    type: 1,
                    index: puck.index,
                    pos: pos,
                    rot: rot,
                    posVelocity: Vector3D.CalcVector(oldObject != null ? new Vector3D(oldObject.posX, oldObject.posY, oldObject.posZ) : null, pos),
                    rotVelocity: Vector3D.CalcVector(oldObject != null ? new Vector3D(oldObject.rotX, oldObject.rotY, oldObject.rotZ) : null, rot),
                    touchedBy: lastTouched
                });
            });

            withVectors.push(packet);

            if (pauseStartPacket === null && prevPeriod === tick.period && prevTime === tick.time) {
                pauseStartPacket = tick.packetNumber;
            }
            else if (pauseStartPacket != null && (prevPeriod != tick.period || prevTime != tick.time)) {
                result.pauses.push({
                    startPacket: pauseStartPacket,
                    endPacket: tick.packetNumber,
                });
                pauseStartPacket = null;
            }

            prevPeriod = tick.period;
            prevTime = tick.time;

            prevTick = tick;

            j++;
        })

        let prevTouched: any = null;
        let shotDetected: ReplayTeam | null = null;

        var index = 0;
        j = 0;

        withVectors.forEach(tick => {
            var isPaused = result.pauses.findIndex(x => x.startPacket < tick.packet && x.endPacket > tick.packet) !== -1;
            if (isPaused) {
                shotDetected = null;
                prevTouched = null;
            }

            if (tick.objects.filter((x: any) => x.type === 1).length === 1 && !isPaused) {
                var currentPacketData = ticks.find(x => x.packetNumber === tick.packet);
                var puck = tick.objects.find((x: any) => x.type === 1);
                var lastTouchedBy = puck.touchedBy ?? prevTouched;

                if (puck.touchedBy != null && shotDetected != null) {
                    if (puck.touchedBy != prevTouched) {
                        var foundPlayer = currentPacketData?.playersInList.find(x => x.index === lastTouchedBy);
                        if (foundPlayer) {
                            if (foundPlayer.team != shotDetected) {
                                var goalFound = false;
                                for (var i = tick.Packet; i <= tick.Packet + 300; i++) {
                                    var nextTick = withVectors.find(x => x.packet === i);
                                    if (nextTick != null) {
                                        var goalInNextTick = result.goals.find(x => x.packet === nextTick.packet);
                                        if (goalInNextTick != null) {
                                            goalFound = true;
                                        }
                                    }
                                }

                                if (!goalFound) {
                                    result.saves.push({
                                        name: foundPlayer.name,
                                        packet: tick.Packet
                                    });
                                }
                            }
                        }

                        shotDetected = null;
                    }
                }
                if (lastTouchedBy != null) {
                    if (currentPacketData) {
                        var foundPlayer = currentPacketData.playersInList.find(x => x.index === lastTouchedBy);
                        if (foundPlayer) {
                            var playerInPossession = result.possession.find(x => x.name === foundPlayer?.name);
                            if (playerInPossession != null) {
                                playerInPossession.touches += 1;
                            }
                            else {
                                result.possession.push({
                                    name: foundPlayer.name,
                                    touches: 1
                                });
                            }

                            //shot counter
                            if (shotDetected === null) {
                                let t, x, y = 0;

                                var puckGoingTo = puck.posVelocity.z < 0 ? ReplayTeam.Red : ReplayTeam.Blue;

                                if (puckGoingTo === ReplayTeam.Red) {
                                    t = (4.15 - puck.pos.z) / puck.posVelocity.z;
                                }
                                else {
                                    t = (56.85 - puck.pos.z) / puck.posVelocity.z;
                                }

                                x = puck.pos.x + puck.posVelocity.x * t;
                                y = puck.pos.y + puck.posVelocity.y * t;

                                if (x > 13.75 && x < 16.25 && puckGoingTo === ReplayTeam.Red) {
                                    if (y < .83) {
                                        if (puck.pos.z < 10 && puck.pos.z > 3.8 && puck.pos.x < 19 && puck.pos.x > 11) {
                                            if (foundPlayer.team === ReplayTeam.Red) {
                                                var packetNumber = tick.packet;
                                                if (puck.touchedBy === null) {
                                                    for (let i = index + 1; i >= 0; i--) {
                                                        var oldPuck = withVectors[i].objects.find((x: any) => x.type === 1);
                                                        if (oldPuck != null) {
                                                            if (oldPuck.touchedBy === lastTouchedBy) {
                                                                packetNumber = i;
                                                                break;
                                                            }
                                                        }
                                                    }
                                                }

                                                result.shots.push({
                                                    name: foundPlayer.name,
                                                    packet: packetNumber,
                                                });
                                                shotDetected = ReplayTeam.Red;
                                            }
                                        }
                                    }
                                } else if (x > 13.75 && x < 16.25 && puckGoingTo === ReplayTeam.Blue) {
                                    if (y < .83) {
                                        if (puck.pos.z > 51 && puck.pos.z < 57.2 && puck.pos.x < 19 && puck.pos.x > 11) {
                                            if (foundPlayer.team === ReplayTeam.Blue) {
                                                var packetNumber = tick.packet;
                                                if (puck.touchedBy === null) {
                                                    for (let i = index + 1; i >= 0; i--) {
                                                        var oldPuck = withVectors[i].objects.find((x: any) => x.type === 1);
                                                        if (oldPuck != null) {
                                                            if (oldPuck.touchedBy === lastTouchedBy) {
                                                                packetNumber = i;
                                                                break;
                                                            }
                                                        }
                                                    }
                                                }

                                                result.shots.push({
                                                    name: foundPlayer.name,
                                                    packet: packetNumber,
                                                });
                                                shotDetected = ReplayTeam.Blue;
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }

                    prevTouched = lastTouchedBy;
                }
            }
            index += 1;

            j++;
        })

        return result;
    }
}