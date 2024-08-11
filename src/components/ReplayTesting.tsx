import { Button, Checkbox, Progress, Space, Upload, UploadFile, UploadProps } from "antd";
import { useMemo, useRef, useState } from "react";
import { UploadOutlined } from '@ant-design/icons';
import { useAppDispatch } from "hooks/useAppDispatch";
import { processHrpLocal } from "stores/season/async-actions";
import { PlayerInList, ReplayMessage, ReplayMessageType, ReplayPlayer, ReplayPuck, ReplayTick } from "models/IReplayViewerResponse";
import ReplayViewer from "./ReplayViewer";
import ReplayParserService from "services/ReplayParserService";
import { IReplayChatMessage } from "models/IReplayChatMessage";
import { VscDebugStart } from "react-icons/vsc";
import { LoadingOutlined } from "@ant-design/icons"
import ReplayCalcService from "services/ReplayCalcService";
import { HighlightType, IReplayHighlight } from "models/IReplayHighlight";
import { orderBy } from "lodash";
import { IReplayGoalResponse } from "models/IReplayGoalResponse";

const API_URL = process.env.REACT_APP_API_URL;

const ReplayTesting = () => {
    const dispatch = useAppDispatch();

    const [uploading, setUploading] = useState<boolean>(false);
    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const [fragments, setFragments] = useState<ReplayTick[]>([]);
    const [chatMessages, setChatMessages] = useState<IReplayChatMessage[]>([]);
    const [calcHighlights, setCalcHighlights] = useState<boolean>(false);
    const [highlights, setHighlights] = useState<IReplayHighlight[]>([]);
    const [goals, setGoals] = useState<IReplayGoalResponse[]>([]);

    const transformKeys = (obj: any[]) => {
        return obj.map(x => {
            return {
                packetNumber: x.pn,
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
                    } as PlayerInList
                }),
            } as ReplayTick
        })
    }

    const handleUploadNew = () => {


        const file = fileList[0] as unknown as File;

        setUploading(true);

        const reader = new FileReader();
        reader.readAsArrayBuffer(file);
        reader.onloadend = async (evt) => {
            if (evt.target && evt.target.readyState == FileReader.DONE) {
                const arrayBuffer = evt.target.result as ArrayBuffer;
                const array = new Uint8Array(arrayBuffer);

                var promise = new Promise((resolve: any, reject) => {
                    setTimeout(() => {
                        ReplayParserService.parseHrpFile(array).then((result) => {
                            const chat: IReplayChatMessage[] = [];

                            result.forEach(tick => {
                                tick.m.filter(x => x.rmt === ReplayMessageType.Chat).forEach(m => {
                                    chat.push({
                                        text: (m.pn ? m.pn + ": " : "") + m.m,
                                        packet: tick.pn
                                    })
                                })
                            })

                            const transformed = transformKeys(result);

                            if (calcHighlights) {
                                const calc = ReplayCalcService.GetReplayCalcData(transformed);
                                const h: IReplayHighlight[] = [];

                                calc.shots.forEach(s => {
                                    h.push({
                                        id: "",
                                        type: HighlightType.Shot,
                                        packet: s.packet,
                                        name: s.name
                                    })
                                })

                                calc.saves.forEach(s => {
                                    h.push({
                                        id: "",
                                        type: HighlightType.Save,
                                        packet: s.packet,
                                        name: s.name
                                    })
                                })

                                setHighlights(orderBy(h, "packet"))

                                const g: IReplayGoalResponse[] = [];
                                calc.goals.forEach(goal => {
                                    g.push({
                                        packet: goal.packet,
                                        goalBy: goal.goalBy,
                                        period: goal.period,
                                        time: goal.time
                                    })
                                })

                                setGoals(g);
                            }

                            setChatMessages(chat);
                            setFragments(transformed);
                            setUploading(false);
                        });

                        resolve();
                    }, 0)
                });





            }
        }
    };

    const props: UploadProps = {
        onRemove: (file) => {
            const index = fileList.indexOf(file);
            const newFileList = fileList.slice();
            newFileList.splice(index, 1);
            setFileList(newFileList);
        },
        beforeUpload: (file) => {
            setFileList([file]);

            return false;
        },
        fileList,
        accept: ".hrp"
    };

    return (
        <div>
            {fragments.length !== 0 &&
                <ReplayViewer externalFragments={fragments} externalChats={chatMessages} externalHighlights={highlights} externalGoals={goals} />
            }
            {fragments.length === 0 &&
                <>
                    <Space direction="vertical" size="middle">
                        <Upload {...props}>
                            <Button icon={<UploadOutlined />}>Select File</Button>
                        </Upload>
                        <Checkbox value={calcHighlights} onChange={(value) => setCalcHighlights(value.target.checked)}>Calculate highlights</Checkbox>
                        <Button
                            type="primary"
                            onClick={handleUploadNew}
                            disabled={fileList.length === 0 || uploading}
                            style={{ marginTop: 16 }}
                            icon={uploading ? <LoadingOutlined /> : <VscDebugStart />}
                        >
                            {uploading ? 'Processing' : 'Start upload'}
                        </Button>
                    </Space>
                </>
            }
        </div>
    )
}

export default ReplayTesting;