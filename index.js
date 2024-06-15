import * as THREE from "three";
import { OrbitControls } from "jsm/controls/OrbitControls.js"

// Create items needed for a scene: renderer, camera, scene

// Renderer

const w = window.innerWidth;
const h = window.innerHeight;
const renderer = new THREE.WebGLRenderer({ antialias: true });
// set renderer height and width
renderer.setSize(w, h);
document.body.appendChild(renderer.domElement);

// Camera

const fov = 60;
const aspect = w / h;
const near = 0.4;
const far = 10;
const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
camera.position.z = 4; // 2

// Scene

const scene = new THREE.Scene();

// Object control
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.01;

const geo = new THREE.IcosahedronGeometry(5.0, 2);
const mat = new THREE.MeshStandardMaterial({
  color: 0x00a1ff,
  //   wireframe: true,
  flatShading: true,
}); // add material
const mesh = new THREE.Mesh(geo, mat); // container for geometry and material
scene.add(mesh);

const wireMat = new THREE.MeshStandardMaterial({
  color: 0xffffff,
  wireframe: true,
});
const wireMesh = new THREE.Mesh(geo, wireMat);
wireMesh.scale.setScalar(1.001);
mesh.add(wireMesh);

// Add light
const hemiLight = new THREE.HemisphereLight(0xff99ff, 0xaa5500);
scene.add(hemiLight);

const animate = (t = 0) => {
  console.log(t);
  requestAnimationFrame(animate);
    // mesh.scale.setScalar(Math.cos(t * 0.001) + 1.0)
    mesh.rotation.y = t * 0.0001;
  renderer.render(scene, camera);
  controls.update();
};

animate();
