import { useEffect, useRef, useState } from "react";
import jQuery from "jquery";
import * as THREE from "three";
import styles from './ReplayViewer.module.css'
import ReplayParserService from "services/ReplayParserService";
import { IFragment, IReplayViewerResponse, ReplayMessage, ReplayMessageType, ReplayPlayer, ReplayPuck, ReplayTick } from "models/IReplayViewerResponse";
import ReplayService from "services/ReplayService";
import { ReplayTeam } from "models/IReplayTick";
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry';
import { Font, FontLoader } from "three/examples/jsm/loaders/FontLoader";
import { isMobile } from "react-device-detect";
import { Button, Select, Slider } from "antd";
import { CaretRightOutlined, PauseOutlined, LoadingOutlined, WarningOutlined } from "@ant-design/icons";
import { URL } from "url";
import { useAppDispatch } from "hooks/useAppDispatch";
import { getStoryReplayViewer } from "stores/season/async-actions";
import { useSelector } from "react-redux";
import { selectStorageUrl } from "stores/season";

const tempDataUrl = "https://s3.timeweb.cloud/27d30bc2-08dbec28-3409-4942-b60d-37f2afd0d688/2d0ffa37-84c4-4572-a0d1-a85e8c8f877b/replayGoals/ebff8df9-fd3a-46c0-9440-eb2b335af4a3e995f12b-479c-4486-909f-5c58707d85d6.json";

const redMaterial = new THREE.MeshPhongMaterial({
    color: 0x8c1010,
});
const blueMaterial = new THREE.MeshPhongMaterial({
    color: 0x10108c,
});

interface IProps {
    externalId?: string;
    externalPlayerName?: string;
    pause?: boolean;
    onReady?: (startTick: number, currentId: string) => void;
    onTickChanged?: (tick: number) => void;
}

const ReplayViewerNew = ({ externalId, pause, externalPlayerName, onReady, onTickChanged }: IProps) => {
    const dispatch = useAppDispatch();

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

        if (externalId) {
            setCurrentId(externalId);

            dispatch(getStoryReplayViewer({
                id: externalId,
            })).unwrap().then((data: IReplayViewerResponse) => {
                const path = storageUrl + data.url;
                jQuery.getJSON(path, function (data) {
                    const d = ReplayParserService.transformKeys(data);

                    setMin(d[0].packetNumber)
                    setCurrentTick(d[0].packetNumber)
                    setMax(d[d.length - 1].packetNumber)
                    setLoading(false);
                    setDataReady(true);
                    init(d);
                });
            });
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

    const init = async (data: ReplayTick[]) => {
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

            function animate() {
                const currentIdDiv = document.getElementById("currentId");
                const currentIdTemp = currentIdDiv ? currentIdDiv.innerText : "";

                setTimeout(function () {
                    if (externalId === currentIdTemp) {
                        requestAnimationFrame(animate);
                    }
                }, 10);

                const frameNumber = getFrame();
                const frame = data[frameNumber];

                if (frame) {
                    processMessages(frame.messages.filter(x => x.replayMessageType === ReplayMessageType.PlayerUpdate), scene, camera, font);
                    processMovement(frame.players, frame.pucks, scene, camera);
                    processCamera(camera, frame.pucks[0], frame)
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

    const processCamera = (camera: THREE.PerspectiveCamera, puck: ReplayPuck, frame: ReplayTick) => {
        const playerInList = frame.playersInList.find(x => x.name === externalPlayerName);
        if (playerInList) {
            const playerObject = frame.players.find(x => x.index === playerInList.index);
            if (playerObject) {
                const firstPuck = puck;
                const puckPos = new THREE.Vector3(firstPuck.posX, 0, firstPuck.posZ);
                const position = new THREE.Vector3(playerObject.posX, playerObject.posY, playerObject.posZ);
                var dir = new THREE.Vector3();
                var vec = dir.subVectors(puckPos, position).normalize();
                var euler = new THREE.Euler(vec.x, vec.y, vec.z);
                const quaternion = new THREE.Quaternion().setFromEuler(euler);
                const offset = new THREE.Vector3(0, 0, playerInList.team === ReplayTeam.Red ? 9 : -9);
                const rotatedOffset = offset.applyQuaternion(quaternion);
                const positionBehind = position.clone().add(rotatedOffset);
                camera.position.set(Math.min(Math.max(positionBehind.x, 1), 29), 2, Math.min(Math.max(positionBehind.z, 1), 60));
                camera.lookAt(puckPos)
            }
        } else {
            const howLongFromCenter = puck.posZ - 30.5;
            const x = puck.posX * 0.5;
            camera.position.setZ(30.5 + howLongFromCenter * 0.2);
            camera.position.setY(2 + (0.1 * puck.posX));
            camera.position.setX(x);
            camera.lookAt(puck.posX, puck.posY, puck.posZ);
        }


    }

    const processMovement = (players: ReplayPlayer[], pucks: ReplayPuck[], scene: THREE.Scene, camera: THREE.PerspectiveCamera) => {
        players.forEach(player => {
            moveObject("upper", player.index, player, scene, camera);
            moveObject("lower", player.index, player, scene, camera);
            moveObject("stick", player.index, player, scene, camera);
            moveObject("text", player.index, player, scene, camera);
            moveObject("textPlane", player.index, player, scene, camera);
            moveObject("avatarPlane", player.index, player, scene, camera);
        })

        pucks.forEach(puck => {
            movePuck(puck.index, puck, scene);
        })
    }

    const movePuck = (index: number, puck: ReplayPuck, scene: THREE.Scene) => {
        const object = scene.getObjectByName("puck" + puck.index);
        if (object) {
            object.position.set(puck.posX, puck.posY, puck.posZ);
            object.rotation.set(puck.rotX, -puck.rotY, puck.rotZ);
        } else {
            const objectLower = scene.getObjectByName("basepuck");
            if (objectLower) {
                const newObject = objectLower.clone();
                newObject.name = "puck" + index;
                scene.add(newObject);
            }
        }
    }

    const moveObject = (name: string, index: number, player: ReplayPlayer, scene: THREE.Scene, camera: THREE.PerspectiveCamera) => {
        const object = scene.getObjectByName(name + player.index);
        if (object) {
            if (name === "stick") {
                object.position.set(player.stickPosX, player.stickPosY, player.stickPosZ);
                object.rotation.set(player.stickRotX, -player.stickRotY, player.stickRotZ);
            } else if (name === "text") {
                object.position.set(player.posX, player.posY + 1, player.posZ);
                object.lookAt(camera.position)
            } else {
                object.position.set(player.posX, player.posY, player.posZ);
                object.rotation.set(player.rotX, -player.rotY, player.rotZ);
            }

            if (name === "upper") {
                object.rotateOnAxis(new THREE.Vector3(1, 0, 0), -player.bodyLean);
                object.rotateOnAxis(new THREE.Vector3(0, 1, 0), player.headTurn);
            }

        }
    }

    const processMessages = (msgs: ReplayMessage[], scene: THREE.Scene, camera: THREE.PerspectiveCamera, font: Font) => {
        msgs.forEach(msg => {
            const team = msg.team === ReplayTeam.Red ? "red" : "blue";
            const objectUpper = scene.getObjectByName("base" + team + "upper");
            const isExistsUpper = scene.getObjectByName("upper" + msg.objectIndex);
            if (objectUpper && !isExistsUpper) {
                const newObject = objectUpper.clone();
                newObject.name = "upper" + msg.objectIndex;
                scene.add(newObject);
            }

            const objectLower = scene.getObjectByName("base" + team + "lower");
            const isExistsLower = scene.getObjectByName("lower" + msg.objectIndex);
            if (objectLower && !isExistsLower) {
                const newObject = objectLower.clone();
                newObject.name = "lower" + msg.objectIndex;
                scene.add(newObject);
            }

            const objectStick = scene.getObjectByName("basestick");
            const isExistsStick = scene.getObjectByName("stick" + msg.objectIndex);
            if (objectStick && !isExistsStick) {
                const newObject = objectStick.clone();
                newObject.name = "stick" + msg.objectIndex;
                newObject.traverse(function (child) {
                    if (child instanceof THREE.Mesh) {

                        child.material = (msg.team === ReplayTeam.Red) ? redMaterial : blueMaterial;
                    }
                });
                scene.add(newObject);
            }


            const isExistsText = scene.getObjectByName("text" + msg.objectIndex);
            if (!isExistsText) {
                const geometry = new TextGeometry(msg.playerName, {
                    font: font,
                    size: 0.15,
                    depth: 0.1,
                })

                geometry.center();

                const color = msg.team === ReplayTeam.Red ? 0x8c1010 : 0x10108c;

                var group = new THREE.Object3D();
                group.name = "text" + msg.objectIndex;
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

        })
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
            <div className={styles.slider} style={{ bottom: isMobile ? 56 : 16, display: "none" }} >
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