import "./style.css";

import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

/**
 * 必須の3要素
 */
// Canvas
const canvas = document.querySelector("canvas.webgl");

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

// Scene
const scene = new THREE.Scene();

//Camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.z = 30;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * オブジェクト作成
 */
const geometry = new THREE.TorusGeometry(10, 3, 16, 100);
const material = new THREE.MeshStandardMaterial({
  color: "#87cefa",
});
const torus = new THREE.Mesh(geometry, material);

scene.add(torus);

//パーティクル
const count = 6000;
const particleGeometry = new THREE.BufferGeometry();
const positionArray = new Float32Array(count * 3);

for (let i = 0; i < count * 3; i++) {
  positionArray[i] = (Math.random() - 0.5) * 150;
}

particleGeometry.setAttribute(
  "position",
  new THREE.BufferAttribute(positionArray, 3)
);

//マテリアル
const particleMaterial = new THREE.PointsMaterial({
  size: 0.2,
});

//メッシュ
const particle = new THREE.Points(particleGeometry, particleMaterial);

scene.add(particle);

//red sphere
const redSphereTexture = new THREE.TextureLoader().load(
  "textures/basecolor.jpg"
);
const normalTexture = new THREE.TextureLoader().load("textures/normal.jpg");

const roughnessTexture = new THREE.TextureLoader().load("textures/normal.jpg");

const ambientTexture = new THREE.TextureLoader().load(
  "textures/ambientOcclusion.jpg"
);

const redSphere = new THREE.Mesh(
  new THREE.SphereGeometry(7, 32, 32),
  new THREE.MeshStandardMaterial({
    map: redSphereTexture,
    normalMap: normalTexture,
    roughnessMap: roughnessTexture,
    metalness: 0.2,
    roughness: 0.5,
    lightMap: ambientTexture,
    lightMapIntensity: 0.7,
  })
);

redSphere.position.set(-10, 0, 25);
scene.add(redSphere);

/* カメラ制御 */
function moveCamera() {
  const t = document.body.getBoundingClientRect().top;
  if (t > 0) {
    return;
  }

  redSphere.rotation.x += 0.05;
  redSphere.rotation.y += 0.075;
  redSphere.rotation.z += 0.05;

  camera.position.z = t * -0.01;
  camera.position.x = t * -0.0002;
  camera.rotation.y = t * -0.0002;
}

document.body.onscroll = moveCamera;

//背景用のテクスチャ
const textureLoader = new THREE.TextureLoader();
const bgTexture = textureLoader.load("images/bg3.jpg");
scene.background = bgTexture;

/**
 * ライト
 */
const pointLight = new THREE.PointLight(0xffffff);
pointLight.position.set(5, 5, 5);

const ambientLight = new THREE.AmbientLight(0xffffff);
scene.add(pointLight, ambientLight);

const lightHelper = new THREE.PointLightHelper(pointLight);
const gridHelper = new THREE.GridHelper(200, 50);
scene.add(lightHelper);

/**
 * カメラ制御
 */
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

const tick = () => {
  requestAnimationFrame(tick);

  torus.rotation.x += 0.01;
  torus.rotation.y += 0.005;
  torus.rotation.z += 0.01;

  controls.update();
  renderer.render(scene, camera);
};

tick();

//ブラウザのリサイズ操作
window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});
