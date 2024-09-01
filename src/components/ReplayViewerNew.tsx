import { useEffect, useState } from "react";
import jQuery from "jquery";
import * as THREE from "three";
import styles from './ReplayViewer.module.css'
import ReplayParserService from "services/ReplayParserService";
import { ReplayMessageType } from "models/IReplayViewerResponse";
import ReplayService from "services/ReplayService";
import { IPlayerInList, IReplayMessage, IReplayPlayer, IReplayPuck, IReplayTick, ReplayTeam } from "models/IReplayTick";
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry';
import { Font, FontLoader } from "three/examples/jsm/loaders/FontLoader";
import { isMobile } from "react-device-detect";
import { Button, Slider } from "antd";
import { CaretRightOutlined, PauseOutlined, LoadingOutlined, WarningOutlined } from "@ant-design/icons";
import { useAppDispatch } from "hooks/useAppDispatch";
import { getGameData } from "stores/season/async-actions";
import { useSelector } from "react-redux";
import { selectStorageUrl } from "stores/season";
import { useSearchParams } from "react-router-dom";
import { IGameResponse } from "models/IGameResponse";

const redMaterial = new THREE.MeshPhongMaterial({
    color: 0x8c1010,
});
const blueMaterial = new THREE.MeshPhongMaterial({
    color: 0x10108c,
});

interface IProps {
    externalId?: string;
    externalUrl?: string;
    externalPlayerName?: string;
    pause?: boolean;
    onReady?: (startTick: number, currentId: string) => void;
    onTickChanged?: (tick: number) => void;
}

const ReplayViewerNew = ({ externalId, externalUrl, pause, externalPlayerName, onReady, onTickChanged }: IProps) => {
    const dispatch = useAppDispatch();

    const [searchParams, setSearchParams] = useSearchParams();

    const storageUrl = useSelector(selectStorageUrl);

    const [loading, setLoading] = useState<boolean>(true);
    const [paused, setPaused] = useState<boolean>(true);
    const [currentTick, setCurrentTick] = useState<number>(0);
    const [min, setMin] = useState<number>(0);
    const [max, setMax] = useState<number>(0);
    const [sceneReady, setSceneReady] = useState<boolean>(false);
    const [dataReady, setDataReady] = useState<boolean>(false);
    const [currentId, setCurrentId] = useState<string>("");

    useEffect(() => {
        setSceneReady(false);
        setDataReady(false);

        if (externalId && externalUrl) {
            setCurrentId(externalId);

            const path = storageUrl + externalUrl;
            jQuery.getJSON(path, (data: IReplayTick[]) => {
                const max = data[data.length - 1].pn + 1;
                data.forEach((element, index) => {
                    data.push({
                        ...element,
                        pn: max + index,
                    })
                });

                data.forEach((element, index) => {
                    element.pn = index;
                });

                setMin(data[0].pn)
                setCurrentTick(data[0].pn)
                setMax(data[data.length - 1].pn)
                setLoading(false);
                setDataReady(true);
                init(data);
            });
        } else {
            const id = searchParams.get("id");
            const t = searchParams.get("t");

            if (id) {
                setCurrentId(id);

                dispatch(getGameData({
                    id: id
                })).unwrap().then((data: IGameResponse) => {
                    fetch(data.replayUrl).then(response => {
                        response.arrayBuffer().then(buffer => {
                            const bytes = new Uint8Array(buffer);
                            ReplayParserService.parseHrpFile(bytes).then((result) => {
                                setMin(result[0].pn)
                                setCurrentTick(result[0].pn)
                                setMax(result[result.length - 1].pn)
                                setLoading(false);
                                setDataReady(true);
                                init(result);
                            })
                        });
                    })
                });
            }
        }
    }, [externalId])

    useEffect(() => {
        if (pause === true) {
            setPaused(true)
        }
        if (pause === false) {
            setPaused(false)
        }
    }, [pause])

    useEffect(() => {
        let interval: any = null;
        if (!paused && !loading) {
            interval = setInterval(() => {
                let newTick = currentTick;
                if (currentTick <= max) {
                    newTick = currentTick + 1;
                } else {
                    newTick = min;
                }
                setCurrentTick(newTick);

                if (onTickChanged) {
                    onTickChanged(newTick)
                }
            }, 10);

        } else if (paused && currentTick !== 0 && interval) {
            clearInterval(interval);
        }
        return () => clearInterval(interval);
    }, [paused, currentTick, loading]);

    useEffect(() => {
        if (dataReady && sceneReady && onReady) {
            onReady(currentTick, currentId);
        }
    }, [dataReady, sceneReady])

    const init = async (data: IReplayTick[]) => {
        let w = 0;
        let h = 0;

        const rv = document.getElementById("replay-viewer-canvas");
        if (rv) {
            w = rv.clientWidth;
            h = rv.clientHeight;
        }

        const scene = await ReplayService.getDefaultScene();

        const camera = new THREE.PerspectiveCamera(60, w / h, 0.1, 1000);
        camera.rotateY(90);
        camera.position.set(30, 10, 30.5);

        if (rv) {
            const renderer = new THREE.WebGLRenderer({
                canvas: rv
            })

            renderer.setSize(w, h);

            const fontLoader = new FontLoader()
            const font = await fontLoader.loadAsync('/fonts/helvetiker_bold.typeface.json');

            setSceneReady(true);

            let currentPlayerList: IPlayerInList[] = [];

            function animate() {
                const currentIdDiv = document.getElementById("currentId");
                const currentIdTemp = currentIdDiv ? currentIdDiv.innerText : "";

                setTimeout(function () {
                    if (externalId === currentIdTemp || !externalId) {
                        requestAnimationFrame(animate);
                    }
                }, 10);

                const frameNumber = getFrame();
                const frame = data.find(x => x.pn === frameNumber);
                if (frame) {
                    currentPlayerList = processMessages(frame.m, scene, font, currentPlayerList);
                    processMovement(frame.pl, frame.pc, scene, camera);
                    processCamera(camera, frame.pc[0], frame, currentPlayerList, frame.pn > 300)
                    processOverlays(frame)
                }

                const rv = document.getElementById("replay-viewer");
                if (rv) {
                    w = rv.clientWidth;
                    h = rv.clientHeight;
                }
                renderer.setSize(w, h);
                camera.aspect = w / h;
                camera.updateProjectionMatrix();

                renderer.render(scene, camera);

            }

            animate();
        }
    }

    const getFrame = () => {
        const ls = document.getElementsByClassName("ant-slider-handle")[0];
        if (ls) {
            const t = ls.getAttribute("aria-valuenow");

            return t ? +t : 0;
        }
        return 0;
    }

    const processOverlays = (frame: IReplayTick) => {
        const scoreContent = document.getElementById("score-content");
        if (scoreContent) {

            let p = frame.p + " period";
            if (frame.p > 3) {
                p = "OT";
            }

            const m = Math.floor(frame.t / 100 / 60);
            const s = frame.t / 100 - m * 60;

            let secString = Math.round(s).toString();

            if (secString.length === 1) {
                secString = "0" + secString;
            }

            const timeWithPeriod = p + " " + m + ":" + secString;

            scoreContent.innerText = frame.rs + " - " + frame.bs + " " + timeWithPeriod;
        }
    }

    const processCamera = (camera: THREE.PerspectiveCamera, puck: IReplayPuck, frame: IReplayTick, currentPlayerList: IPlayerInList[], netView: boolean) => {
        const playerInList = currentPlayerList.find(x => x.n === externalPlayerName);
        if (playerInList) {
            const playerObject = frame.pl.find(x => x.i === playerInList.i);
            if (playerObject) {
                if (!netView) {
                    const firstPuck = puck;
                    const puckPos = new THREE.Vector3(firstPuck.x, 0, firstPuck.z);
                    const position = new THREE.Vector3(playerObject.x, playerObject.y, playerObject.z);
                    var dir = new THREE.Vector3();
                    var vec = dir.subVectors(puckPos, position).normalize();
                    var euler = new THREE.Euler(vec.x, vec.y, vec.z);
                    const quaternion = new THREE.Quaternion().setFromEuler(euler);
                    const offset = new THREE.Vector3(0, 0, playerInList.t === ReplayTeam.Red ? 9 : -9);
                    const rotatedOffset = offset.applyQuaternion(quaternion);
                    const positionBehind = position.clone().add(rotatedOffset);
                    camera.position.set(Math.min(Math.max(positionBehind.x, 1), 29), 2, Math.min(Math.max(positionBehind.z, 1), 60));
                    camera.lookAt(puckPos)
                } else {
                    const firstPuck = puck;
                    const puckPos = new THREE.Vector3(firstPuck.x, 0, firstPuck.z);
                    camera.position.set(15, 2.5, playerObject.tm === ReplayTeam.Red ? 60 : 1);
                    camera.lookAt(puckPos)
                }
            }
        } else {
            const howLongFromCenter = puck.z - 30.5;
            const x = puck.x * 0.5;
            camera.position.setZ(30.5 + howLongFromCenter * 0.2);
            camera.position.setY(2 + (0.1 * puck.x));
            camera.position.setX(x);
            camera.lookAt(puck.x, puck.y, puck.z);
        }


    }

    const processMovement = (players: IReplayPlayer[], pucks: IReplayPuck[], scene: THREE.Scene, camera: THREE.PerspectiveCamera) => {
        players.forEach(player => {
            moveObject("upper", player.i, player, scene, camera);
            moveObject("lower", player.i, player, scene, camera);
            moveObject("stick", player.i, player, scene, camera);
            moveObject("text", player.i, player, scene, camera);
        })

        pucks.forEach(puck => {
            movePuck(puck.i, puck, scene);
        })

        const toRemove: string[] = [];
        scene.traverse(object => {
            if (object.isObject3D) {
                if (object.name.startsWith("puck") && pucks.filter(x => "puck" + x.i === object.name).length === 0) {
                    toRemove.push(object.name);
                }
            }
        })
        toRemove.forEach(x => {
            const toRemoveObject = scene.getObjectByName(x);
            if (toRemoveObject) {
                toRemoveObject.removeFromParent();
            }
        })
    }

    const movePuck = (index: number, puck: IReplayPuck, scene: THREE.Scene) => {
        const object = scene.getObjectByName("puck" + puck.i);
        if (object) {
            object.position.set(puck.x, puck.y, puck.z);
            object.rotation.set(puck.rx, -puck.ry, puck.rz);
        } else {
            const objectLower = scene.getObjectByName("basepuck");
            if (objectLower) {
                const newObject = objectLower.clone();
                newObject.name = "puck" + index;
                scene.add(newObject);
            }
        }
    }

    const removeObject = (name: string, index: number, scene: THREE.Scene) => {
        const object = scene.getObjectByName(name + index);
        if (object) {
            scene.remove(object);
        }

    }

    const moveObject = (name: string, index: number, player: IReplayPlayer, scene: THREE.Scene, camera: THREE.PerspectiveCamera) => {
        const object = scene.getObjectByName(name + player.i);
        if (object) {
            if (name === "stick") {
                object.position.set(player.spx, player.spy, player.spz);
                object.rotation.set(player.srx, -player.sry, player.srz);
            } else if (name === "text") {
                object.position.set(player.x, player.y + 1, player.z);
                object.lookAt(camera.position)
            } else {
                object.position.set(player.x, player.y, player.z);
                object.rotation.set(player.rx, -player.ry, player.rz);
            }

            if (name === "upper") {
                object.rotateOnAxis(new THREE.Vector3(1, 0, 0), -player.bl);
                object.rotateOnAxis(new THREE.Vector3(0, 1, 0), player.ht);
            }

        }
    }

    const processMessages = (msgs: IReplayMessage[], scene: THREE.Scene, font: Font, playerInList: IPlayerInList[]) => {
        msgs.forEach(msg => {
            if (msg.rmt === ReplayMessageType.PlayerUpdate) {
                if (playerInList.filter(x => x.i === msg.pi).length === 0) {
                    playerInList.push({
                        i: msg.pi,
                        n: msg.pn,
                        t: msg.t
                    } as IPlayerInList)
                }

                if (msg.t !== ReplayTeam.Spectator) {
                    const team = msg.t === ReplayTeam.Red ? "red" : "blue";
                    const objectUpper = scene.getObjectByName("base" + team + "upper");
                    const isExistsUpper = scene.getObjectByName("upper" + msg.oi);
                    if (objectUpper && !isExistsUpper) {
                        const newObject = objectUpper.clone();
                        newObject.name = "upper" + msg.oi;
                        scene.add(newObject);
                    }

                    const objectLower = scene.getObjectByName("base" + team + "lower");
                    const isExistsLower = scene.getObjectByName("lower" + msg.oi);
                    if (objectLower && !isExistsLower) {
                        const newObject = objectLower.clone();
                        newObject.name = "lower" + msg.oi;
                        scene.add(newObject);
                    }

                    const objectStick = scene.getObjectByName("basestick");
                    const isExistsStick = scene.getObjectByName("stick" + msg.oi);
                    if (objectStick && !isExistsStick) {
                        const newObject = objectStick.clone();
                        newObject.name = "stick" + msg.oi;
                        newObject.traverse(function (child) {
                            if (child instanceof THREE.Mesh) {

                                child.material = (msg.t === ReplayTeam.Red) ? redMaterial : blueMaterial;
                            }
                        });
                        scene.add(newObject);
                    }


                    const isExistsText = scene.getObjectByName("text" + msg.oi);
                    if (!isExistsText) {
                        const geometry = new TextGeometry(msg.pn, {
                            font: font,
                            size: 0.15,
                            depth: 0.1,
                        })

                        geometry.center();

                        const color = msg.t === ReplayTeam.Red ? 0x8c1010 : 0x10108c;

                        var group = new THREE.Object3D();
                        group.name = "text" + msg.oi;
                        group.updateMatrix();

                        const mesh = new THREE.Mesh(geometry, [new THREE.MeshPhongMaterial({ color: color })]);
                        group.add(mesh);

                        const size = mesh.geometry.boundingBox;
                        if (size) {
                            const geometry = rectangleRounded(size.max.x - size.min.x + 0.2, 0.25, 0.1, 10);
                            const material = new THREE.MeshBasicMaterial({ color: color, side: THREE.FrontSide, transparent: true, opacity: 0.1 });
                            const plane = new THREE.Mesh(geometry, material);

                            group.add(plane);
                        }
                        scene.add(group);
                    }
                } else {
                    const player = playerInList[msg.pi]
                    if (player) {
                        removeObject("upper", player.i, scene)
                        removeObject("lower", player.i, scene)
                        removeObject("stick", player.i, scene)
                        removeObject("text", player.i, scene)
                        removeObject("lower", player.i, scene)

                        playerInList = playerInList.filter((x, index) => index !== msg.pi)
                    }
                }
            }
        })

        return playerInList;
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

    const onPlayPause = () => {
        setPaused(!paused);
    }

    const onChange = (value: number) => {
        setCurrentTick(value);
    }

    return (
        <div className={styles.viewerContainer + " content-without-padding"} >
            <div id="replay-viewer" className={styles.replayViewer} style={{ borderRadius: !isMobile ? 8 : 0, top: externalId ? 0 : 48, height: externalId ? "100%" : (isMobile ? "calc(-92px + 100%)" : "calc(-48px + 100%)") }} >
                <canvas
                    style={{ borderRadius: externalId && !isMobile ? 8 : 0 }}
                    id="replay-viewer-canvas"
                    className={styles.replayCanvas}
                />
            </div>
            <div className={styles.score} style={externalId ? { opacity: 0.5, bottom: 16 } : { top: 68 }}>
                <span id="score-content" />
            </div>
            <div className={styles.slider} style={{ bottom: isMobile ? 56 : 16, display: externalId ? "none" : undefined }} >
                <Button type="text" icon={loading ? <LoadingOutlined /> : (paused ? <CaretRightOutlined /> : <PauseOutlined />)} onClick={onPlayPause} />
                <Slider
                    id="loop-slider"
                    className={styles.sliderItem + " loop-slider"}
                    min={min}
                    max={max}
                    value={currentTick}
                    onChange={onChange}
                />
            </div>
            <div id="currentId" style={{ display: "none" }}>{currentId}</div>
        </div>
    )
}

export default ReplayViewerNew;