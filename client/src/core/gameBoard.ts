import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

interface GraphicsData {
  model: string;
  posX?: number;
  posY?: number;
  posZ?: number;
  children: GraphicsData[];
}

function loadModel(path: string) {
  return new Promise<THREE.Group>((resolve, reject) => {
    const loader = new GLTFLoader();

    loader.load(path, (gltf) => resolve(gltf.scene), undefined, reject);
  });
}

async function buildSceneFromData(data: GraphicsData) {
  const modelPromise = loadModel(data.model);
  const children = data.children.map<[GraphicsData, Promise<THREE.Group>]>(
    (child) => [child, buildSceneFromData(child)]
  );
  const model = await modelPromise;
  for (let child of children) {
    const [childData, childModelPromise] = child;
    const childModel = await childModelPromise;
    childModel.position.set(childData.posX, childData.posY, childData.posZ);
    model.add(childModel);
  }
  return model;
}

const calcPoly = (coefs: number[], pos: number) => {
  let factor = pos;
  return coefs.reduce((prev, coef) => {
    const next = prev + coef * factor;
    factor *= pos;
    return next;
  });
};

export class GameboardGraphics {
  private parent: HTMLDivElement;
  private renderer: THREE.WebGLRenderer;
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private clock: THREE.Clock;
  private controls: OrbitControls;
  private disposed = false;

  constructor(parent: HTMLDivElement) {
    this.parent = parent;
    this.animate = this.animate.bind(this);
    this.onResize = this.onResize.bind(this);
    this.initialize();
  }

  async inputGraphicsData(root: GraphicsData) {
    const data = await buildSceneFromData(root);
    this.scene.clear();
    this.scene.add(data);
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

    (window as any).TestModel = async (coords: {
      x?: number;
      y?: number;
      z?: number;
      pos?: number;
      angle?: number;
      radius?: number;
    }) => {
      if (coords.pos !== undefined) {
        const angle =
          coords.angle ||
          calcPoly([-3.5744454867309372e-2, 8.9583472024692079e-2], coords.pos);
        const radius =
          coords.radius ||
          calcPoly(
            [
              9.6782875101673611e1, -2.213185722071942e-2,
              -4.3885400281670449e-3,
            ],
            coords.pos
          );
        coords.x = radius * Math.sin(angle);
        if (coords.y === undefined)
          coords.y =
            -9.3 +
            coords.pos * 0.3 -
            (Math.sin(coords.pos * Math.PI) + 1.0) * 0.4;
        coords.z = radius * Math.cos(angle);
      }
      const data = await buildSceneFromData({
        model: "/models/board.glb",
        children: [
          {
            model: "/models/player.glb",
            children: [],
            posX: coords.x,
            posY: coords.y,
            posZ: coords.z,
          },
        ],
      });
      this.scene.clear();
      this.scene.add(data);
    };
    (window as any).TestModel({});

    this.controls = new OrbitControls(camera, this.renderer.domElement);
    this.controls.target.set(0, 0.5, 0);
    this.controls.maxDistance = 1000.0;
    this.controls.minDistance = 100.0;
    this.controls.update();
    this.controls.enablePan = false;
    this.controls.enableDamping = true;

    this.scene = scene;
    this.camera = camera;
    window.addEventListener("resize", this.onResize);
    this.onResize();
    this.animate();
  }

  onResize() {
    const width = window.innerWidth;
    const height = window.innerHeight * 0.7;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(width, height);
  }

  dispose() {
    console.assert(this.disposed === false);
    this.disposed = true;
    this.renderer.dispose();
    window.removeEventListener("resize", this.onResize);
  }

  animate() {
    if (this.disposed) return;

    requestAnimationFrame(this.animate);

    const delta = this.clock.getDelta();

    this.controls.update();

    /*mixer.update(delta);

    stats.update();*/

    this.renderer.render(this.scene, this.camera);
  }
}
