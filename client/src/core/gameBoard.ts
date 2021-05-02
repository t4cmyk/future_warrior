import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

export class GameboardGraphics {
  private parent: HTMLDivElement;
  private renderer: THREE.WebGLRenderer;
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private clock: THREE.Clock;
  private controls: OrbitControls;

  constructor(parent: HTMLDivElement) {
    this.parent = parent;
    this.animate = this.animate.bind(this);
    this.onResize = this.onResize.bind(this);
    this.initialize();
  }

  private initialize() {
    this.clock = new THREE.Clock();
    this.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    this.renderer.setPixelRatio(window.devicePixelRatio);

    const renderWidth = window.innerWidth;
    const renderHeight = window.innerHeight;

    this.renderer.setSize(renderWidth, renderHeight);
    this.parent.appendChild(this.renderer.domElement);
    const camera = new THREE.PerspectiveCamera(
      45,
      renderWidth / renderHeight,
      1,
      500
    );
    camera.position.set(0, 300, 400);
    camera.far = 100000;
    camera.lookAt(0, 200, 0);
    camera.updateProjectionMatrix();
    // camera.zoom = 0.000001;
    const scene = new THREE.Scene();

    const pmremGenerator = new THREE.PMREMGenerator(this.renderer);
    scene.environment = pmremGenerator.fromScene(
      new RoomEnvironment(),
      0.04
    ).texture;

    this.renderer.setClearColor(0xffffff, 0);
    const loader = new GLTFLoader();

    loader.load(
      "models/board.glb",
      (gltf) => {
        const board = gltf.scene;
        scene.add(board);

        loader.load(
          "models/player.glb",
          (gltf) => {
            board.add(gltf.scene);
          },
          undefined,
          function (error) {
            console.error(error);
          }
        );
      },
      undefined,
      function (error) {
        console.error(error);
      }
    );
    this.controls = new OrbitControls(camera, this.renderer.domElement);
    this.controls.target.set(0, 0.5, 0);
    this.controls.maxDistance = 1000.0;
    this.controls.minDistance = 300.0;
    this.controls.update();
    this.controls.enablePan = false;
    this.controls.enableDamping = true;

    this.renderer.render(scene, camera);
    this.scene = scene;
    this.camera = camera;
    window.addEventListener("resize", this.onResize);
    this.animate();
  }

  onResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  dispose() {
    this.renderer.dispose();
    window.removeEventListener("resize", this.onResize);
  }

  animate() {
    requestAnimationFrame(this.animate);

    const delta = this.clock.getDelta();

    this.controls.update();

    /*mixer.update(delta);

    stats.update();*/

    this.renderer.render(this.scene, this.camera);
  }
}
