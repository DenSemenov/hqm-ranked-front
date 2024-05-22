import * as THREE from "three";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

export default class ReplayService {
    static async getDefaultScene() {
        const scene = new THREE.Scene();

        const ambientLight = new THREE.AmbientLight(0xffffff, 1)
        ambientLight.position.set(15, 5, 30.5)
        scene.add(ambientLight)

        const light = new THREE.DirectionalLight(0xffffff, 1);
        light.position.set(0, 5, 0);
        light.castShadow = true;
        scene.add(light);

        const loader = new GLTFLoader();
        const fbxLoader = new FBXLoader();

        const arena = await loader.loadAsync('/assets/arena.glb')
        scene.add(arena.scene);

        const puck = await loader.loadAsync('/assets/puck.glb');
        puck.scene.position.set(999, 999, 999);
        puck.scene.name = "puck";
        scene.add(puck.scene);

        const stick = await loader.loadAsync('/assets/stick.glb');
        stick.scene.position.set(999, 999, 999);
        stick.scene.name = "stick";
        scene.add(stick.scene);

        const lower = await fbxLoader.loadAsync('/assets/lower.fbx')
        lower.position.set(999, 999, 999);
        lower.scale.set(0.01, 0.01, 0.01);
        lower.traverse(function (child) {
            if (child instanceof THREE.Mesh)
                child.material.color.setRGB(1, 0, 0);
        });
        lower.name = "lower";
        scene.add(lower);

        const upper = await fbxLoader.loadAsync('/assets/upper.fbx');
        upper.position.set(999, 999, 999);
        upper.scale.set(0.01, 0.01, 0.01);
        upper.traverse(function (child) {
            if (child instanceof THREE.Mesh)
                child.material.color.setRGB(1, 0, 0);
        });
        upper.name = "upper";
        scene.add(upper);

        const cubeTextureLoader = new THREE.CubeTextureLoader();
        const texture = await cubeTextureLoader.loadAsync([
            '/assets/skybox/bluecloud_ft.jpg',
            '/assets/skybox/bluecloud_bk.jpg',
            '/assets/skybox/bluecloud_up.jpg',
            '/assets/skybox/bluecloud_dn.jpg',
            '/assets/skybox/bluecloud_rt.jpg',
            '/assets/skybox/bluecloud_lf.jpg',
        ]);
        scene.background = texture;

        return scene;
    }
}
