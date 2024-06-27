import * as THREE from "three";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

export default class ReplayService {
    static async getDefaultScene() {
        const scene = new THREE.Scene();


        var light = new THREE.AmbientLight(0xffffff, 1);
        scene.add(light);

        const loader = new GLTFLoader();
        const fbxLoader = new FBXLoader();

        const arena = await loader.loadAsync('/assets/arena.glb')
        scene.add(arena.scene);

        const puck = await loader.loadAsync('/assets/puck.glb');
        puck.scene.position.set(999, 999, 999);
        puck.scene.name = "puck";
        scene.add(puck.scene);

        const stick = await fbxLoader.loadAsync('/assets/stick.fbx');
        stick.position.set(999, 999, 999);
        stick.scale.set(0.01, 0.01, 0.01);
        stick.name = "stick";
        scene.add(stick);

        const redlower = await loader.loadAsync('/assets/redlower.glb');
        redlower.scene.position.set(999, 999, 999);
        redlower.scene.name = "redlower";
        scene.add(redlower.scene);

        const bluelower = await loader.loadAsync('/assets/bluelower.glb');
        bluelower.scene.position.set(999, 999, 999);
        bluelower.scene.name = "bluelower";
        scene.add(bluelower.scene);

        const redupper = await loader.loadAsync('/assets/redupper.glb');
        redupper.scene.position.set(999, 999, 999);
        redupper.scene.name = "redupper";
        scene.add(redupper.scene);

        const blueupper = await loader.loadAsync('/assets/blueupper.glb');
        blueupper.scene.position.set(999, 999, 999);
        blueupper.scene.name = "blueupper";
        scene.add(blueupper.scene);

        // const cubeTextureLoader = new THREE.CubeTextureLoader();
        // const texture = await cubeTextureLoader.loadAsync([
        //     '/assets/skybox/bluecloud_ft.jpg',
        //     '/assets/skybox/bluecloud_bk.jpg',
        //     '/assets/skybox/bluecloud_up.jpg',
        //     '/assets/skybox/bluecloud_dn.jpg',
        //     '/assets/skybox/bluecloud_rt.jpg',
        //     '/assets/skybox/bluecloud_lf.jpg',
        // ]);
        // scene.background = texture;

        return scene;
    }
}
