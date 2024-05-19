import { Button, Popover, Select, Slider } from "antd";
import { useAppDispatch } from "hooks/useAppDispatch";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { getReplayChatMessages, getReplayGoals, getReplayViewer, getStoryReplayViewer } from "stores/season/async-actions";
import styles from './ReplayViewer.module.css'
import { CaretRightOutlined, PauseOutlined, UnorderedListOutlined, WechatWorkOutlined, BorderOutlined, LoadingOutlined } from "@ant-design/icons";
import { IFragment, IReplayViewerResponse, PlayerInList, ReplayPlayer, ReplayPuck, ReplayTeam, ReplayTick } from "models/IReplayViewerResponse";
import { createSearchParams, useSearchParams } from "react-router-dom";
import * as THREE from "three";
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
import { Font, FontLoader } from 'three/examples/jsm/loaders/FontLoader';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry';
import { IReplayGoalResponse } from "models/IReplayGoalResponse";
import { IReplayChatMessage } from "models/IReplayChatMessage";
import { isMobile } from "react-device-detect";
import ReplayService from "services/ReplayService";

const excludedNames = ["Scene", "lower", "upper", "puck", "stick", "basebluegoal", "baseboardlower", "text", "Circle_Circle.002", "baseboards", "basestick", "baseice", "baseredgoal", "ROOT_UU3D", "Circle_Circle001", "Circle_Circle001_1", "Circle_Circle001_2", "Circle_Circle001_3", "Circle_Circle001_4", "Circle_Circle001_5"]

interface IProps {
    externalId?: string;
    pause?: boolean;
    externalScene?: THREE.Scene;
    onReady?: () => void;
    onStart?: () => void;
}

const ReplayViewer = ({ externalId, pause, externalScene, onReady, onStart }: IProps) => {
    const dispatch = useAppDispatch();

    const [searchParams, setSearchParams] = useSearchParams();
    const [currentTick, setCurrentTick] = useState<number>(0);
    const [paused, setPaused] = useState<boolean>(true);
    const [loading, setLoading] = useState<boolean>(true);
    const [fragments, setFragments] = useState<ReplayTick[]>([]);
    const [loadedIndexes, setLoadedIndexes] = useState<number[]>([]);
    const [indexes, setIndexes] = useState<IFragment[]>([]);
    const [min, setMin] = useState<number>(0);
    const [max, setMax] = useState<number>(0);
    const [currentId, setCurrentId] = useState<string>("");
    const [showPlayers, setShowPlayers] = useState<boolean>(false);
    const [showChat, setShowChat] = useState<boolean>(false);
    const [showMap, setShowMap] = useState<boolean>(false);
    const [loadedObjects, setLoadedObjects] = useState<string[]>([]);
    const [speed, setSpeed] = useState<number>(1);
    const [font, setFont] = useState<Font | null>(null);
    const [goals, setGoals] = useState<IReplayGoalResponse[]>([]);
    const [messages, setMessages] = useState<IReplayChatMessage[]>([]);
    const [sceneReady, setSceneReady] = useState<boolean>(false);
    const [dataReady, setDataReady] = useState<boolean>(false);
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const rendererRef = useRef<any>();
    const cameraRef = useRef<any>();
    const sceneRef = useRef<any>();

    const redMaterial = new THREE.MeshPhongMaterial({
        color: 0xF9665E,
    });
    const blueMaterial = new THREE.MeshPhongMaterial({
        color: 0x799FCB,
    });

    useEffect(() => {
        if (pause === true) {
            setPaused(true)
        }
        if (pause === false) {
            setPaused(false)
        }
    }, [pause])

    useEffect(() => {
        if (externalId) {
            if (onStart) {
                onStart();
            }
            setCurrentId(externalId);
            dispatch(getStoryReplayViewer({
                id: externalId,
            })).unwrap().then((data: IReplayViewerResponse) => {
                fragments.push(...data.data);
                setFragments(fragments);
                setLoadedIndexes([0])

                setMin(data.fragments[0].min)
                setMax(data.fragments[data.fragments.length - 1].max)
                setCurrentTick(data.fragments[0].min);
                setIndexes(data.fragments);
                setLoading(false);

                setCurrentTick(data.fragments[0].min);

                initRenderer();

                setDataReady(true);
            });
        } else {
            const id = searchParams.get("id");
            const t = searchParams.get("t");

            if (id) {
                setCurrentId(id);

                dispatch(getReplayViewer({
                    id: id,
                    index: 0
                })).unwrap().then((data: IReplayViewerResponse) => {
                    fragments.push(...data.data);
                    setFragments(fragments);
                    setLoadedIndexes([0])

                    setMin(data.fragments[0].min)
                    setMax(data.fragments[data.fragments.length - 1].max)
                    setCurrentTick(data.fragments[0].min);
                    setIndexes(data.fragments);
                    setLoading(false);

                    if (t) {
                        let tick = +t;

                        if (tick - 300 > 0) {
                            tick -= 300;
                        }

                        setCurrentTick(tick);
                    }

                    dispatch(getReplayGoals({
                        id: id
                    })).unwrap().then((goals: IReplayGoalResponse[]) => [
                        setGoals(goals)
                    ])

                    dispatch(getReplayChatMessages({
                        id: id
                    })).unwrap().then((msgs: IReplayChatMessage[]) => [
                        setMessages(msgs)
                    ])

                    initRenderer();

                    setDataReady(true);
                });
            }
        }
    }, []);

    useEffect(() => {
        if (dataReady && sceneReady && onReady) {
            onReady();
        }
    }, [dataReady, sceneReady])

    useEffect(() => {
        const nextTickOffset = 100 / speed;
        if (currentTick && fragments.length !== 0) {
            const currentFragment = indexes.find(x => x.min <= currentTick && x.max > currentTick);
            const nextFragment = indexes.find(x => x.min <= currentTick + nextTickOffset && x.max > currentTick + nextTickOffset);
            if (currentFragment) {
                if (loadedIndexes.findIndex(x => x === currentFragment.index) === -1) {
                    loadedIndexes.push(currentFragment.index);
                    setLoadedIndexes(loadedIndexes);
                    setLoading(true);
                    dispatch(getReplayViewer({
                        id: currentId,
                        index: currentFragment.index
                    })).unwrap().then((data) => {
                        if (data.data) {
                            setLoading(false);
                            fragments.push(...data.data);
                            setFragments(fragments);
                        }
                    });
                }
            }
            if (nextFragment && nextFragment !== currentFragment) {
                if (loadedIndexes.findIndex(x => x === nextFragment.index) === -1) {
                    loadedIndexes.push(nextFragment.index);
                    setLoadedIndexes(loadedIndexes);
                    dispatch(getReplayViewer({
                        id: currentId,
                        index: nextFragment.index
                    })).unwrap().then((data) => {
                        if (data.data) {
                            fragments.push(...data.data);
                            setFragments(fragments);
                        }
                    });
                }
            }
        }
    }, [currentTick])

    useEffect(() => {
        let interval: any = null;
        if (!paused && !loading) {
            interval = setInterval(() => {
                let newTick = currentTick;
                if (currentTick + 2 <= max) {
                    newTick = currentTick + 2;
                } else {
                    newTick = min;
                }
                setCurrentTick(newTick);
                if (newTick % 10 === 0 && !externalId) {
                    setSearchParams(
                        createSearchParams({ id: searchParams.get("id") as string, t: newTick.toString() })
                    )
                }
            }, 40 * speed);
        } else if (paused && currentTick !== 0 && interval) {
            clearInterval(interval);
        }
        return () => clearInterval(interval);
    }, [paused, currentTick, loading, speed]);

    useEffect(() => {
        if (rendererRef.current) {
            const renderer = rendererRef.current;
            renderer.setAnimationLoop(renderLoop)
        }

    }, [rendererRef.current, currentTick])

    const renderLoop = useCallback(() => {
        if (rendererRef.current && cameraRef.current && sceneRef.current) {
            const renderer = rendererRef.current;
            const scene = sceneRef.current;
            const camera = cameraRef.current;
            frameChange(currentTick, scene, camera);
            renderer.render(scene, camera)
        }
    }, [rendererRef, cameraRef, sceneRef, currentTick])

    const initRenderer = useCallback(async () => {
        let w = 0;
        let h = 0;

        const rv = document.getElementById("replay-viewer");
        if (rv) {
            w = rv.clientWidth;
            h = rv.clientHeight;
        }

        const renderer = new THREE.WebGLRenderer({
            canvas: canvasRef.current as HTMLCanvasElement,
            antialias: true,
            alpha: true,
        })

        rendererRef.current = renderer;

        const camera = new THREE.PerspectiveCamera(
            60,
            w / h,
            0.1,
            1000
        )
        camera.rotateY(90);
        camera.position.set(30, 6, 30.5);

        cameraRef.current = camera;

        const fontLoader = new FontLoader()

        if (!externalScene) {
            const scene = await ReplayService.getDefaultScene();
            sceneRef.current = scene;

            const font = await fontLoader.loadAsync('/fonts/helvetiker_bold.typeface.json');
            setFont(font);
            setSceneReady(true);
        } else {
            const toRemove: string[] = [];
            externalScene.traverse(object => {
                if (object.isObject3D) {
                    if (object.name !== "" && !object.name.startsWith("base") && !excludedNames.includes(object.name)) {
                        toRemove.push(object.name);
                    }
                }
            })

            toRemove.forEach(x => {
                const toRemoveObject = externalScene.getObjectByName(x);
                if (toRemoveObject) {
                    toRemoveObject.removeFromParent();
                }
            })

            const font = await fontLoader.loadAsync('/fonts/helvetiker_bold.typeface.json');
            setFont(font);

            sceneRef.current = externalScene;

            setSceneReady(true);
        }
        renderer.setSize(w, h)

    }, [currentTick])

    const onPlayPause = () => {
        setPaused(!paused);
    }

    const onChange = (value: number) => {
        setCurrentTick(value);
    }

    const playersContent = useMemo(() => {
        let players: PlayerInList[] = [];

        const tickData = fragments.find(x => x.packetNumber === currentTick);
        if (tickData) {
            players = tickData.playersInList;
        }

        return <div>
            {players.filter(x => x).map(x => {
                let color = "#EEF1E6";
                if (x.team === 0) {
                    color = "#F9665E"
                }
                if (x.team === 1) {
                    color = "#799FCB"
                }
                return <div style={{ color: color }}>{x.name}</div>
            })}
        </div>
    }, [currentTick])

    const mapContent = useMemo(() => {
        let players: PlayerInList[] = [];
        let skaters: ReplayPlayer[] = [];
        let pucks: ReplayPuck[] = [];

        const tickData = fragments.find(x => x.packetNumber === currentTick);
        if (tickData) {
            players = tickData.playersInList;
            skaters = tickData.players;
            pucks = tickData.pucks;
        }

        return <div className={styles.mapContent}>
            {skaters.map(skater => {
                let team = 0;
                const pl = players.find(x => x.index === skater.index);
                if (pl) {
                    team = pl.team;
                }
                return <div className={styles.skater} style={{ top: skater.posZ * 5 - 4, left: skater.posX * 5 - 4, background: team === 0 ? "#F9665E" : "#799FCB" }} />
            })}
            {pucks.map(puck => {
                return <div className={styles.puck} style={{ top: puck.posZ * 5 - 3, left: puck.posX * 5 - 3 }} />
            })}
        </div>
    }, [currentTick])

    const frameChange = (current: number, scene: THREE.Scene, camera: THREE.Camera) => {
        const tickData = fragments.find(x => x.packetNumber === current);
        if (tickData) {
            const existsPlayerLowerNames = tickData.players.map(x => "playerLower" + x.index.toString());
            const existsPlayerUpperNames = tickData.players.map(x => "playerUpper" + x.index.toString());
            const existsPlayerStickNames = tickData.players.map(x => "playerStick" + x.index.toString());
            const existsPlayerTextNames = tickData.players.map(x => "playerText" + x.index.toString());
            const existsPucksNames = tickData.pucks.map(x => "puck" + x.index.toString());
            const toRemove: string[] = [];
            scene.traverse(object => {
                if (object.isObject3D) {
                    if (object.name !== "" && !object.name.startsWith("base") && !excludedNames.includes(object.name) && !existsPlayerLowerNames.includes(object.name) && !existsPlayerUpperNames.includes(object.name) && !existsPucksNames.includes(object.name) && !existsPlayerStickNames.includes(object.name) && !existsPlayerTextNames.includes(object.name)) {
                        toRemove.push(object.name);
                    }
                }
            })

            toRemove.forEach(x => {
                const toRemoveObject = scene.getObjectByName(x);
                if (toRemoveObject) {
                    toRemoveObject.removeFromParent();
                    loadedObjects.filter(x => x.toString() !== x);
                    setLoadedObjects(loadedObjects);
                }
            })

            let first = true;
            tickData.pucks.forEach(puck => {
                const name = "puck" + puck.index.toString();
                let puckObject = scene.getObjectByName(name);
                if (!loadedObjects.includes(name) || !puckObject) {
                    const puckTemp = scene.getObjectByName("puck");
                    if (puckTemp) {
                        loadedObjects.push(name)
                        setLoadedObjects(loadedObjects);
                        const newPuck = puckTemp.clone();
                        newPuck.position.set(puck.posX, puck.posY, puck.posZ)
                        newPuck.rotation.set(puck.rotX, puck.rotY, puck.rotZ)
                        newPuck.name = name;
                        scene.add(newPuck);
                    }
                } else {
                    if (puckObject) {
                        puckObject.position.set(puck.posX, puck.posY, puck.posZ)
                        puckObject.rotation.set(puck.rotX, puck.rotY, puck.rotZ)
                        if (first) {
                            camera.position.setZ(puck.posZ);
                            camera.lookAt(puckObject.position)
                        }

                        first = false;
                    }
                }
            })

            tickData.players.forEach(player => {
                let team = ReplayTeam.Spectator;
                let name = "";
                const foundPlayerInList = tickData.playersInList.find(x => x.index === player.index);
                if (foundPlayerInList) {
                    team = foundPlayerInList.team;
                    name = foundPlayerInList.name;
                }

                const lowerName = "playerLower" + player.index.toString();
                const playerLower = scene.getObjectByName(lowerName);
                if (!loadedObjects.includes(lowerName) || !playerLower) {
                    const playerLowerTemp = scene.getObjectByName("lower");
                    if (playerLowerTemp) {
                        loadedObjects.push(lowerName)
                        setLoadedObjects(loadedObjects);
                        const newPlayerLower = playerLowerTemp.clone();
                        newPlayerLower.position.set(player.posX, player.posY, player.posZ)
                        newPlayerLower.rotation.set(Math.PI * 2 - player.rotX, player.rotY, player.rotX)
                        newPlayerLower.name = lowerName;
                        scene.add(newPlayerLower);
                    }
                } else {
                    if (playerLower) {
                        if (team !== ReplayTeam.Spectator) {
                            playerLower.traverse(function (child) {
                                if (child instanceof THREE.Mesh) {
                                    if (team === 0) {
                                        child.material = redMaterial;
                                    } else {
                                        child.material = blueMaterial;
                                    }
                                }
                            });
                        }
                        playerLower.position.set(player.posX, player.posY, player.posZ)
                        playerLower.rotation.set(Math.PI * 2 - player.rotX, player.rotY, player.rotZ)
                    }
                }

                const upperName = "playerUpper" + player.index.toString();
                let playerUpper = scene.getObjectByName(upperName);
                if (!loadedObjects.includes(upperName) || !playerUpper) {
                    const playerUpperTemp = scene.getObjectByName("upper");
                    if (playerUpperTemp) {
                        loadedObjects.push(upperName)
                        setLoadedObjects(loadedObjects);
                        const newPlayerUpper = playerUpperTemp.clone();
                        newPlayerUpper.position.set(player.posX, player.posY, player.posZ)
                        newPlayerUpper.rotation.set(Math.PI * 2 - player.rotX, player.rotY, player.rotZ)
                        newPlayerUpper.name = upperName;

                        scene.add(newPlayerUpper);

                    }
                } else {
                    if (playerUpper) {
                        if (team !== ReplayTeam.Spectator) {
                            playerUpper.traverse(function (child) {
                                if (child instanceof THREE.Mesh) {
                                    if (team === 0) {
                                        child.material = redMaterial;
                                    } else {
                                        child.material = blueMaterial;
                                    }
                                }
                            });
                        }

                        playerUpper.position.set(player.posX, player.posY, player.posZ)
                        playerUpper.rotation.set(Math.PI * 2 - player.rotX, player.rotY, player.rotZ)
                        playerUpper.rotateOnAxis(new THREE.Vector3(1, 0, 0), -player.bodyLean);
                        playerUpper.rotateOnAxis(new THREE.Vector3(0, 1, 1), -player.headTurn);
                    }
                }

                const stickName = "playerStick" + player.index.toString();
                let playerStick = scene.getObjectByName(stickName);
                if (!loadedObjects.includes(stickName) || !playerStick) {
                    const playerStickTemp = scene.getObjectByName("stick");
                    if (playerStickTemp) {
                        loadedObjects.push(stickName)
                        setLoadedObjects(loadedObjects);
                        const newPlayerStick = playerStickTemp.clone();
                        newPlayerStick.position.set(player.stickPosX, player.stickPosY, player.stickPosZ)
                        newPlayerStick.rotation.set(Math.PI * 2 - player.stickRotX, player.stickRotY, player.stickRotZ)
                        newPlayerStick.name = stickName;

                        scene.add(newPlayerStick);

                    }
                } else {
                    if (playerStick) {
                        playerStick.position.set(player.stickPosX, player.stickPosY, player.stickPosZ)
                        // playerStick.rotation.set(player.stickRotX, player.stickRotY, player.stickRotZ)
                        playerStick.setRotationFromEuler(new THREE.Euler(Math.PI * 2 - player.stickRotX, player.stickRotY, player.stickRotZ));
                    }
                }

                const playerTextName = "playerText" + player.index.toString();
                let playerText = scene.getObjectByName(playerTextName);
                if ((!loadedObjects.includes(playerTextName) || !playerStick) && font) {
                    loadedObjects.push(playerTextName)
                    setLoadedObjects(loadedObjects);
                    const geometry = new TextGeometry(name, {
                        font: font,
                        size: 0.15,
                        depth: 0.1
                    })

                    geometry.center();

                    const mesh = new THREE.Mesh(geometry, [new THREE.MeshPhongMaterial({ color: 0x000000 })]);

                    mesh.position.set(player.posX, player.posY + 1, player.posZ)
                    mesh.name = playerTextName;
                    scene.add(mesh);
                } else {
                    if (playerText) {
                        playerText.position.set(player.posX, player.posY + 1, player.posZ);
                        playerText.lookAt(camera.position)
                    }
                }
            })
        }
    }

    const scoreContent = useMemo(() => {
        let redScore = 0;
        let blueScore = 0;
        let timeWithPeriod = "";

        const tickData = fragments.find(x => x.packetNumber === currentTick);
        if (tickData) {
            redScore = tickData.redScore;
            blueScore = tickData.blueScore;

            let p = tickData.period + " period";
            if (tickData.period > 3) {
                p = "OT";
            }

            const m = Math.floor(tickData.time / 100 / 60);
            const s = tickData.time / 100 - m * 60;

            let secString = Math.round(s).toString();

            if (secString.length === 1) {
                secString = "0" + secString;
            }

            timeWithPeriod = p + " " + m + ":" + secString;
        }

        return <>
            <span>{redScore + " - " + blueScore}</span>
            <span>{timeWithPeriod}</span>
        </>
    }, [currentTick])

    const toObject = (arr: IReplayGoalResponse[]) => {
        var rv: any = {};

        arr.forEach(goal => {
            rv[goal.packet] = {
                label: goal.goalBy,
                style: {
                    fontSize: !isMobile ? 10 : 0,
                },
            };
        })

        return rv;
    }

    const chatContent = useMemo(() => {
        const currentMessages = messages.filter(x => x.packet <= currentTick && x.packet > currentTick - 500);
        return <>
            {currentMessages.map(msg => {
                return <div>{msg.text}</div>
            })}
        </>
    }, [currentTick, messages])

    return (
        <div className={styles.viewerContainer + " content-without-padding"}>
            <div id="replay-viewer" className={styles.replayViewer} style={{ borderRadius: externalId && !isMobile ? 8 : 0, top: externalId ? 0 : 48, height: externalId ? "100%" : (isMobile ? "calc(-92px + 100%)" : "calc(-48px + 100%)") }}>
                <canvas
                    style={{ borderRadius: externalId && !isMobile ? 8 : 0 }}
                    id="replay-viewer-canvas"
                    ref={canvasRef}
                    className={styles.replayCanvas}
                />
            </div>
            {!externalId &&
                <>
                    <div className={styles.playerList}>
                        <Popover content={playersContent} trigger="click" placement="bottomLeft" open={showPlayers}>
                            <Button icon={<UnorderedListOutlined />} onClick={() => setShowPlayers(!showPlayers)} />
                        </Popover>
                    </div>
                    <div className={styles.chatMessages} style={{ bottom: isMobile ? 122 : 82 }}>
                        <Popover content={chatContent} trigger="click" placement="topLeft" open={showChat}>
                            <Button icon={<WechatWorkOutlined />} onClick={() => setShowChat(!showChat)} />
                        </Popover>
                    </div>
                    <div className={styles.map}>
                        <Popover content={mapContent} overlayClassName={styles.overlayWithout} trigger="click" placement="bottomRight" open={showMap}>
                            <Button icon={<BorderOutlined />} onClick={() => setShowMap(!showMap)} />
                        </Popover>
                    </div>
                    <div className={styles.score}>
                        {scoreContent}
                    </div>
                    <div className={styles.slider} style={{ bottom: isMobile ? 56 : 16 }}>
                        <Button type="text" icon={loading ? <LoadingOutlined /> : (paused ? <CaretRightOutlined /> : <PauseOutlined />)} onClick={onPlayPause} />
                        <Slider
                            className={styles.sliderItem}
                            min={min}
                            max={max}
                            value={currentTick}
                            marks={toObject(goals)}
                            onChange={onChange}
                        />
                        <Select
                            style={{ width: 70 }}
                            value={speed}
                            options={[
                                { value: 2, label: '0.5x' },
                                { value: 1, label: '1x' },
                                { value: 0.5, label: '2x' },
                                { value: 0.2, label: '5x' },
                            ]}
                            onChange={setSpeed}
                        />
                    </div>
                </>
            }
        </div>
    )
}

export default ReplayViewer;
