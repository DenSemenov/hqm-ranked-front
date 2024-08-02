import { Button, Col, Popover, Row, Select, Slider, Tag, Tooltip, Typography, notification } from "antd";
import { useAppDispatch } from "hooks/useAppDispatch";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { getPatrol, getReplayChatMessages, getReplayGoals, getReplayHighlights, getReplayViewer, getReportViewer, getRules, getStoryReplayViewer, getStoryReplayViewerJson, reportDecision } from "stores/season/async-actions";
import styles from './ReplayViewer.module.css'
import { CaretRightOutlined, PauseOutlined, UnorderedListOutlined, WechatWorkOutlined, BorderOutlined, LoadingOutlined, OrderedListOutlined, WarningOutlined, InfoCircleOutlined } from "@ant-design/icons";
import { IFragment, IReplayViewerResponse, PlayerInList, ReplayMessage, ReplayPlayer, ReplayPuck, ReplayTeam, ReplayTick } from "models/IReplayViewerResponse";
import { createSearchParams, useNavigate, useSearchParams } from "react-router-dom";
import * as THREE from "three";
import { Font, FontLoader } from 'three/examples/jsm/loaders/FontLoader';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry';
import { IReplayGoalResponse } from "models/IReplayGoalResponse";
import { IReplayChatMessage } from "models/IReplayChatMessage";
import { isMobile } from "react-device-detect";
import ReplayService from "services/ReplayService";
import { IReplayHighlight } from "models/IReplayHighlight";
import { uniqBy } from "lodash";
import { useSelector } from "react-redux";
import { selectIsAuth } from "stores/auth";
import ReportModal from "./ReportModal";
import Stats from 'stats.js'
import { selectStorageUrl } from "stores/season";
import jQuery from "jquery";
import axios from "axios";

const excludedNames = ["Scene", "redupper", "blueupper", "redlower", "bluelower", "puck", "stick", "basebluegoal", "baseboardlower", "text", "baseboards", "basestick", "baseice", "baseredgoal"]

const { Text, Title } = Typography;

interface IProps {
    externalId?: string;
    externalPlayerName?: string;
    pause?: boolean;
    externalScene?: THREE.Scene;
    reportId?: string;
    onReady?: (startTick: number, currentId: string) => void;
    onTickChanged?: (tick: number) => void;
}

const ReplayViewer = ({ externalId, pause, externalScene, externalPlayerName, reportId, onReady, onTickChanged }: IProps) => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const isAuth = useSelector(selectIsAuth);
    const storageUrl = useSelector(selectStorageUrl);

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
    const [showHighlights, setShowHighlights] = useState<boolean>(false);
    const [loadedObjects, setLoadedObjects] = useState<string[]>([]);
    const [speed, setSpeed] = useState<number>(1);
    const [goals, setGoals] = useState<IReplayGoalResponse[]>([]);
    const [messages, setMessages] = useState<IReplayChatMessage[]>([]);
    const [highlights, setHighlights] = useState<IReplayHighlight[]>([]);
    const [sceneReady, setSceneReady] = useState<boolean>(false);
    const [dataReady, setDataReady] = useState<boolean>(false);
    const [selectedObject, setSelectedObject] = useState<string>("Puck 0");
    const [reportModalOpen, setReportModalOpen] = useState<boolean>(false);
    const [gameId, setGameId] = useState<string>("");
    const [stats, setStats] = useState<Stats>(new Stats());
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const rendererRef = useRef<any>();
    const cameraRef = useRef<any>();
    const sceneRef = useRef<any>();

    const redMaterial = new THREE.MeshPhongMaterial({
        color: 0x8c1010,
    });
    const blueMaterial = new THREE.MeshPhongMaterial({
        color: 0x10108c,
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
        dispatch(getRules());
        // stats.showPanel(0)
        // document.body.appendChild(stats.dom)
    }, []);

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
                messages: [] as ReplayMessage[],
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


    useEffect(() => {
        setDataReady(false);
        setSceneReady(false);
        if (externalId) {
            setCurrentId(externalId);
            dispatch(getStoryReplayViewer({
                id: externalId,
            })).unwrap().then((data: IReplayViewerResponse) => {
                const path = storageUrl + data.url;
                jQuery.getJSON(path, function (data) {
                    const renamed = transformKeys(data) as ReplayTick[];
                    fragments.push(...renamed);
                    setFragments(fragments);
                    setLoadedIndexes([0])

                    setMin(renamed[0].packetNumber)
                    setMax(renamed[renamed.length - 1].packetNumber)
                    setCurrentTick(renamed[0].packetNumber);
                    const f: IFragment[] = [];
                    setIndexes(f);
                    setLoading(false);
                    initRenderer();

                    setDataReady(true);
                });
                // fragments.push(...data.data);
                // setFragments(fragments);
                // setLoadedIndexes([0])

                // setMin(data.fragments[0].min)
                // setMax(data.fragments[data.fragments.length - 1].max)
                // setCurrentTick(data.fragments[0].min);
                // setIndexes(data.fragments);
                // setLoading(false);

                // setCurrentTick(data.fragments[0].min);
                // initRenderer();

                // setDataReady(true);
            });
        } else if (reportId) {
            setCurrentId(reportId);

            dispatch(getReportViewer({
                id: reportId,
            })).unwrap().then((data: IReplayViewerResponse) => {
                fragments.push(...data.data);
                setFragments(fragments);
                setLoadedIndexes([0])
                setGameId(data.gameId);
                setMin(data.fragments[0].min)
                setMax(data.fragments[data.fragments.length - 1].max)
                setCurrentTick(data.fragments[0].min);
                setIndexes(data.fragments);
                setLoading(false);

                setSelectedObject("Reported")

                initRenderer();
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
                    setGameId(data.gameId);
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

                    dispatch(getReplayHighlights({
                        id: id
                    })).unwrap().then((msgs: IReplayHighlight[]) => [
                        setHighlights(msgs)
                    ])

                    initRenderer();

                    setDataReady(true);
                });
            }
        }
    }, [externalId]);

    useEffect(() => {
        if (dataReady && sceneReady && onReady) {
            onReady(currentTick, currentId);
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

                if (onTickChanged) {
                    onTickChanged(newTick)
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

    const renderLoop = (f: Font) => {
        const ls = document.getElementsByClassName("ant-slider-handle")[0];
        if (ls) {
            const t = ls.getAttribute("aria-valuenow");

            const os = document.getElementById("objectSelector");
            if (os) {
                const osVal = os.parentElement?.parentElement?.children[1];
                if (osVal) {
                    const selected = osVal.innerHTML;
                    if (rendererRef.current && cameraRef.current && sceneRef.current && t) {

                        stats.begin()
                        let tick = t ? +t : 0;

                        const renderer = rendererRef.current;
                        const scene = sceneRef.current;
                        const camera = cameraRef.current;
                        frameChange(tick, scene, camera, f, selected);

                        renderer.render(scene, camera)
                        stats.end()
                    }
                }
            }
        }
    }

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
        })

        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFShadowMap;

        const camera = new THREE.PerspectiveCamera(
            60,
            w / h,
            0.1,
            100
        )



        camera.rotateY(90);
        camera.position.set(30, 10, 30.5);

        cameraRef.current = camera;

        const fontLoader = new FontLoader()
        const font = await fontLoader.loadAsync('/fonts/helvetiker_bold.typeface.json');

        if (!externalScene) {
            const scene = await ReplayService.getDefaultScene();
            sceneRef.current = scene;

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

            sceneRef.current = externalScene.clone();
            setSceneReady(true);
        }
        renderer.setSize(w, h)

        rendererRef.current = renderer;

        const r = rendererRef.current;
        r.setAnimationLoop(() => renderLoop(font))

    }, [currentTick])

    const onPlayPause = () => {
        setPaused(!paused);
    }

    const onChange = (value: number) => {
        setCurrentTick(value);
    }

    const currentPlayers = useMemo(() => {
        let players: PlayerInList[] = [];

        const tickData = fragments.find(x => x.packetNumber === currentTick);
        if (tickData) {
            players = tickData.playersInList;
        }

        return players.map(x => x.name);
    }, [currentTick, fragments])

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
                    color = "#8c1010"
                }
                if (x.team === 1) {
                    color = "#10108c"
                }
                return <div style={{ color: color }}>{x.name}</div>
            })}
        </div>
    }, [currentTick, fragments])

    const objectsItems = useMemo(() => {
        let objects: { value: string, label: string }[] = [];

        const tickData = fragments.find(x => x.packetNumber === currentTick);
        if (tickData) {
            objects.push(...tickData.playersInList.map(x => {
                return {
                    value: x.name,
                    label: x.name
                }
            }));
            objects.push(...tickData.pucks.map(x => {
                const name = "Puck " + x.index;
                return {
                    value: name,
                    label: name
                }
            }));
        }

        return objects;
    }, [currentTick, selectedObject, fragments])

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
                let name = "";
                const pl = players.find(x => x.index === skater.index);
                if (pl) {
                    team = pl.team;
                    name = pl.name;
                }
                return <>
                    <div className={styles.skaterName} style={{ top: skater.posZ * 5 - 4, left: skater.posX * 5 - 4 }}><span>{name}</span></div>
                    <div className={styles.skater} style={{ top: skater.posZ * 5 - 4, left: skater.posX * 5 - 4, background: team === 0 ? "#F9665E" : "#799FCB" }} />
                </>
            })}
            {pucks.map(puck => {
                return <div className={styles.puck} style={{ top: puck.posZ * 5 - 3, left: puck.posX * 5 - 3 }} />
            })}
        </div>
    }, [currentTick, fragments])

    const handlePlayerObject = (objectType: string, player: ReplayPlayer, index: number, loadedObjects: string[], scene: THREE.Scene, team: ReplayTeam) => {
        const objectName = `${objectType}${index}`;
        let object = scene.getObjectByName(objectName);


        if (!loadedObjects.includes(objectName) || !object) {
            let objectToClone = objectType;

            if (objectType === "upper") {
                if (team === ReplayTeam.Red) {
                    objectToClone = "redupper"
                } else {
                    objectToClone = "blueupper"
                }
            }

            if (objectType === "lower") {
                if (team === ReplayTeam.Red) {
                    objectToClone = "redlower"
                } else {
                    objectToClone = "bluelower"
                }
            }

            const objectTemp = scene.getObjectByName(objectToClone);
            if (objectTemp) {
                loadedObjects.push(objectName);
                setLoadedObjects(loadedObjects);
                const newObject = objectTemp.clone();

                if (objectType === "stick") {
                    newObject.position.set(player.stickPosX, player.stickPosY, player.stickPosZ);
                    newObject.rotation.set(Math.PI * 2 - player.stickRotX, player.stickRotY, player.stickRotZ);
                } else {
                    newObject.position.set(player.posX, player.posY, player.posZ);
                    newObject.rotation.set(Math.PI * 2 - player.rotX, player.rotY, player.rotZ);
                }

                if (objectType === "upper") {
                    newObject.rotateOnAxis(new THREE.Vector3(1, 0, 0), -player.bodyLean);
                    newObject.rotateOnAxis(new THREE.Vector3(0, 1, 0), -player.headTurn);
                }

                newObject.name = objectName;
                newObject.castShadow = true;

                if (objectType === "stick") {
                    if (team !== ReplayTeam.Spectator) {
                        newObject.traverse(function (child) {
                            if (child instanceof THREE.Mesh) {

                                child.material = (team === ReplayTeam.Red) ? redMaterial : blueMaterial;
                            }
                        });
                    }
                }

                scene.add(newObject);
            }
        } else {
            if (object) {
                if (objectType === "stick") {
                    object.position.set(player.stickPosX, player.stickPosY, player.stickPosZ);
                    object.rotation.set(Math.PI * 2 - player.stickRotX, player.stickRotY, player.stickRotZ);
                } else {
                    object.position.set(player.posX, player.posY, player.posZ);
                    object.rotation.set(Math.PI * 2 - player.rotX, player.rotY, player.rotZ);

                    if (objectType === "upper") {
                        object.rotateOnAxis(new THREE.Vector3(1, 0, 0), -player.bodyLean);
                        object.rotateOnAxis(new THREE.Vector3(0, 1, 0), -player.headTurn);
                    }
                }
            }
        }

        return object;
    }

    const rectangleRounded = (w: number, h: number, r: number, s: number) => {
        const pi2 = Math.PI * 2;
        const n = (s + 1) * 4;
        let indices = [];
        let positions = [];
        let uvs = [];
        let qu, sgx, sgy, x, y;

        for (let j = 1; j < n + 1; j++) indices.push(0, j, j + 1);
        indices.push(0, n, 1);
        positions.push(0, 0, 0);
        uvs.push(0.5, 0.5);
        for (let j = 0; j < n; j++) contour(j);

        const geometry = new THREE.BufferGeometry();
        geometry.setIndex(new THREE.BufferAttribute(new Uint32Array(indices), 1));
        geometry.setAttribute(
            "position",
            new THREE.BufferAttribute(new Float32Array(positions), 3)
        );
        geometry.setAttribute(
            "uv",
            new THREE.BufferAttribute(new Float32Array(uvs), 2)
        );

        return geometry;

        function contour(j: number) {
            qu = Math.trunc((4 * j) / n) + 1;
            sgx = qu === 1 || qu === 4 ? 1 : -1;
            sgy = qu < 3 ? 1 : -1;
            x = sgx * (w / 2 - r) + r * Math.cos((pi2 * (j - qu + 1)) / (n - 4));
            y = sgy * (h / 2 - r) + r * Math.sin((pi2 * (j - qu + 1)) / (n - 4));

            positions.push(x, y, 0);
            uvs.push(0.5 + x / w, 0.5 + y / h);
        }
    }

    const frameChange = (current: number, scene: THREE.Scene, camera: THREE.Camera, font: Font, selectedObject: string) => {
        const tickData = fragments.find(x => x.packetNumber === current);
        if (tickData) {
            const existsPlayerLowerNames = tickData.players.map(x => "lower" + x.index.toString());
            const existsPlayerUpperNames = tickData.players.map(x => "upper" + x.index.toString());
            const existsPlayerStickNames = tickData.players.map(x => "stick" + x.index.toString());
            const existsPlayerTextNames = tickData.players.map(x => "text" + x.index.toString());
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

            tickData.pucks.forEach(puck => {
                const name = "puck" + puck.index.toString();
                let puckObject = scene.getObjectByName(name);
                if (!loadedObjects.includes(name) || !puckObject) {
                    const puckTemp = scene.getObjectByName("puck");
                    if (puckTemp) {
                        loadedObjects.push(name);
                        setLoadedObjects(loadedObjects);
                        const newPuck = puckTemp.clone();
                        newPuck.position.set(puck.posX, puck.posY, puck.posZ)
                        newPuck.rotation.set(Math.PI * 2 - puck.rotX, puck.rotY, puck.rotZ)
                        newPuck.name = name;
                        scene.add(newPuck);
                    }
                } else {
                    if (puckObject) {
                        puckObject.position.set(puck.posX, puck.posY, puck.posZ)
                        puckObject.rotation.set(Math.PI * 2 - puck.rotX, puck.rotY, puck.rotZ)

                        if (!externalPlayerName) {
                            if (selectedObject === "Puck " + puck.index) {
                                const howLongFromCenter = puck.posZ - 30.5;
                                const x = puck.posX * 0.5;
                                camera.position.setZ(30.5 + howLongFromCenter * 0.2);
                                camera.position.setY(2 + (0.1 * puck.posX));
                                camera.position.setX(x);
                                camera.lookAt(puckObject.position)
                            }
                        }
                    }
                }
            });

            tickData.players.forEach(player => {
                let team = ReplayTeam.Spectator;
                let name = "";

                const foundPlayerInList = tickData.playersInList.find(x => x.index === player.index);
                if (foundPlayerInList) {
                    team = foundPlayerInList.team;
                    name = foundPlayerInList.name;
                }

                handlePlayerObject("lower", player, player.index, loadedObjects, scene, team);
                handlePlayerObject("upper", player, player.index, loadedObjects, scene, team);
                handlePlayerObject("stick", player, player.index, loadedObjects, scene, team);
                const playerTextName = "text" + player.index.toString();
                let playerText = scene.getObjectByName(playerTextName);
                let playerTextPlane = scene.getObjectByName("base" + playerTextName);

                if (selectedObject === name || externalPlayerName === name) {
                    const firstPuck = tickData.pucks[0];
                    const puckPos = new THREE.Vector3(firstPuck.posX, 0, firstPuck.posZ);
                    const position = new THREE.Vector3(player.posX, player.posY, player.posZ);
                    var dir = new THREE.Vector3();
                    var vec = dir.subVectors(puckPos, position).normalize();
                    var euler = new THREE.Euler(vec.x, vec.y, vec.z);
                    const quaternion = new THREE.Quaternion().setFromEuler(euler);
                    const offset = new THREE.Vector3(0, 0, team === ReplayTeam.Red ? 9 : -9);
                    const rotatedOffset = offset.applyQuaternion(quaternion);
                    const positionBehind = position.clone().add(rotatedOffset);
                    camera.position.set(Math.min(Math.max(positionBehind.x, 1), 29), 2, Math.min(Math.max(positionBehind.z, 1), 60));
                    camera.lookAt(puckPos)
                }


                if ((!loadedObjects.includes(playerTextName) || !playerText) && font) {
                    loadedObjects.push(playerTextName)
                    setLoadedObjects(loadedObjects);
                    const geometry = new TextGeometry(name, {
                        font: font,
                        size: 0.15,
                        depth: 0.1,
                    })

                    geometry.center();

                    const mesh = new THREE.Mesh(geometry, [new THREE.MeshPhongMaterial({ color: 0x000 })]);
                    mesh.position.set(player.posX, player.posY + 1, player.posZ)
                    mesh.name = playerTextName;

                    const size = mesh.geometry.boundingBox;
                    if (size) {
                        const geometry = rectangleRounded(size.max.x - size.min.x + 0.2, 0.25, 0.1, 10);
                        const material = new THREE.MeshBasicMaterial({ color: "#9c9c9c", side: THREE.FrontSide, transparent: true, opacity: 0.4 });
                        const plane = new THREE.Mesh(geometry, material);
                        plane.position.set(player.posX, player.posY + 1, player.posZ)
                        plane.lookAt(camera.position)
                        plane.name = "base" + playerTextName;
                        scene.add(plane);
                    }
                    scene.add(mesh);
                } else {
                    if (playerText) {
                        playerText.position.set(player.posX, player.posY + 1, player.posZ);
                        playerText.lookAt(camera.position)
                    }

                    if (playerTextPlane) {
                        playerTextPlane.position.set(player.posX, player.posY + 1, player.posZ);
                        playerTextPlane.lookAt(camera.position)
                    }
                }



            });
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
    }, [currentTick, fragments])

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

    const highlightContent = useMemo(() => {
        return <div className={styles.highlightList}>
            {uniqBy(highlights, "packet").map(msg => {
                const type = msg.type === 0 ? "Shot" : "Save";
                return <div className={styles.highlightListItem} onClick={() => setCurrentTick(msg.packet - 250)}>{msg.name}<Tag color={type === "Shot" ? "blue" : "green"}>{type}</Tag></div>
            })}
        </div>
    }, [highlights])

    const onSendReport = () => {
        setPaused(true);
        setReportModalOpen(true);
    }

    const onReportDecision = (isReported: boolean) => {
        if (reportId) {
            dispatch(reportDecision({
                id: reportId,
                isReported: isReported
            })).unwrap().then(() => {
                dispatch(getPatrol());
                navigate("/");
                notification.info({
                    message: "Thank you for your cooperation"
                })
            });
        }
    }

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
            {!externalId && !reportId &&
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
                    <div className={styles.highlights} style={{ bottom: isMobile ? 122 : 82 }}>
                        <Popover content={highlightContent} trigger="click" placement="bottomLeft" open={showHighlights}>
                            <Button icon={<OrderedListOutlined />} onClick={() => setShowHighlights(!showHighlights)} />
                        </Popover>
                    </div>
                    <div className={styles.score}>
                        {scoreContent}
                    </div>
                </>
            }
            {reportId &&
                <div className={styles.reportOverlay}>
                    <Title level={5}>Report decision</Title>
                    <Row gutter={8}>
                        <Col span={12}>
                            <Button style={{ width: "100%" }} type="primary" onClick={() => onReportDecision(true)}>Report</Button>
                        </Col>
                        <Col span={12}>
                            <Button danger style={{ width: "100%" }} onClick={() => onReportDecision(false)}>Cancel</Button>
                        </Col>
                    </Row>
                </div>
            }
            <div className={styles.slider} style={{ bottom: isMobile ? 56 : 16, display: !externalId ? "flex" : "none" }} >
                <Button type="text" icon={loading ? <LoadingOutlined /> : (paused ? <CaretRightOutlined /> : <PauseOutlined />)} onClick={onPlayPause} />
                <Slider
                    id="loop-slider"
                    className={styles.sliderItem + " loop-slider"}
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

                <Select
                    id="objectSelector"
                    style={{ width: 100, display: !reportId ? "flex" : "none" }}
                    value={selectedObject}
                    options={objectsItems}
                    onChange={setSelectedObject}
                />
                <Button
                    style={{ display: !reportId ? "flex" : "none" }}
                    type="text"
                    danger
                    icon={<WarningOutlined />}
                    onClick={onSendReport}
                    title={"Report"}
                    disabled={!isAuth}
                />
            </div>
            {reportModalOpen &&
                <ReportModal open={reportModalOpen} onClose={() => setReportModalOpen(false)} gameId={gameId} tick={currentTick} />
            }
        </div>
    )
}

export default ReplayViewer;
