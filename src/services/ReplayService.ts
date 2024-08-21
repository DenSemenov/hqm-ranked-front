import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

export default class ReplayService {
    static async getDefaultScene() {
        const scene = new THREE.Scene();

        scene.background = new THREE.Color(0xff0000);

        var lightAmb = new THREE.AmbientLight(0xffffff, 0.7);
        scene.add(lightAmb);
        var light = new THREE.DirectionalLight(0xffffff, 1);
        light.castShadow = true;
        light.shadow.bias = 0.0001;
        light.shadow.mapSize.width = 2048;
        light.shadow.mapSize.height = 1024;
        scene.add(light);

        const loader = new GLTFLoader();

        const arena = await loader.loadAsync('/assets/arena.glb')
        arena.scene.receiveShadow = true;
        scene.add(arena.scene);

        return scene;
    }
}
