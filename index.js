// Import necessary modules from THREE.js
import * as THREE from "three";
import { OrbitControls } from "jsm/controls/OrbitControls.js";
import spline from "./spline.js";

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

// Fog
scene.fog = new THREE.FogExp2(0x000000, 0.3);

// Object controls for the camera
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.03;

// create a line geometry from the spline
const points = spline.getPoints(100);
const geo = new THREE.BufferGeometry().setFromPoints(points);
const material = new THREE.LineBasicMaterial({ color: 0x00ff00 });

const line = new THREE.Mesh(geo, material);
// scene.add(line);

// create a tube geometry from the spline
const tubeGeo = new THREE.TubeGeometry(spline, 222, 0.65, 16, true);
const tubeMat = new THREE.MeshBasicMaterial({
  color: 0x0099ff,
  side: THREE.DoubleSide,
  wireframe: true,
});
const tube = new THREE.Mesh(tubeGeo, tubeMat);
// scene.add(tube);

// create edges geometry
const edgesGeo = new THREE.EdgesGeometry(tubeGeo, 0.2);
const lineMat = new THREE.LineBasicMaterial({ color: 0x00ff00 });
const tubeLines = new THREE.LineSegments(edgesGeo, lineMat);
scene.add(tubeLines);

// Add hemisphere light to the scene
// const hemiLight = new THREE.HemisphereLight(0xff99ff, 0xaa5500);
// scene.add(hemiLight);

console.log(spline);

// Fly through functionality

const updateCamera = (t) => {
  const time = t * 0.08;
  const looptime = 10 * 1000;
  const p = (time % looptime) / looptime;
  const pos = tubeGeo.parameters.path.getPointAt(p);
  const lookAt = tubeGeo.parameters.path.getPointAt((p + 0.03) % 1);
  camera.position.copy(pos);
  camera.lookAt(lookAt);
};

// Animation loop
const animate = (t = 0) => {
  requestAnimationFrame(animate);
  updateCamera(t);
  renderer.render(scene, camera);
  controls.update();
};

animate();

const handleWindowSize = () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
};
window.addEventListener("resize", handleWindowSize, false);
