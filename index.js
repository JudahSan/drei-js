// Import necessary modules from THREE.js
import * as THREE from "three";
import { OrbitControls } from "jsm/controls/OrbitControls.js";

const h = window.innerHeight;
const w = window.innerWidth;

// Renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(w, h);
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.outputColorSpace = THREE.SRGBColorSpace;
document.body.appendChild(renderer.domElement);

// Camera
const camera = new THREE.PerspectiveCamera(75, w / h, 0.1, 1000);
camera.position.z = 4;

// Scene
const scene = new THREE.Scene();

// Object controls for the camera
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.01;

// Create geometry and material for cube
const geo = new THREE.BoxGeometry();
const material = new THREE.MeshStandardMaterial({
  color: 0xffffff,
  wireframe: true,
});

const cube = new THREE.Mesh(geo, material);
scene.add(cube);

// Add hemisphere light to the scene
const hemiLight = new THREE.HemisphereLight(0xff99ff, 0xaa5500);
scene.add(hemiLight);

// Animation loop
const animate = () => {
  requestAnimationFrame(animate);

  cube.rotation.x += 0.01;
  cube.rotation.y += 0.02;
  renderer.render(scene, camera);
  controls.update();
};

animate();