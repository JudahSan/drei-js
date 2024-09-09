// Import necessary modules from THREE.js
import * as THREE from "three";
import { OrbitControls } from "jsm/controls/OrbitControls.js";
import spline from "./spline.js";
import { EffectComposer } from "jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "jsm/postprocessing/UnrealBloomPass.js";

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
scene.fog = new THREE.FogExp2(0x000000, 0.5);

// Object controls for the camera
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.03;

// post-processing
const renderScene = new RenderPass(scene, camera);
const bloomPass = new UnrealBloomPass(new THREE.Vector2(w, h), 1.5, 0.4, 100);
bloomPass.threshold = 0.002;
bloomPass.strength = 3.5;
bloomPass.radius = 0;
const composer = new EffectComposer(renderer);
composer.addPass(renderScene);
composer.addPass(bloomPass);


// create a tube geometry from the spline
const tubeGeo = new THREE.TubeGeometry(spline, 222, 0.65, 16, true);
const tubeMat = new THREE.MeshLambertMaterial({
  color: 0x00ff00,
  side: THREE.DoubleSide,
  wireframe: true,
});
const tube = new THREE.Mesh(tubeGeo, tubeMat);
scene.add(tube);

// create edges geometry
const edgesGeo = new THREE.EdgesGeometry(tubeGeo, 0.2);
const lineMat = new THREE.LineBasicMaterial({ color: 0x00ff00 });
const tubeLines = new THREE.LineSegments(edgesGeo, lineMat);
scene.add(tubeLines);

// Add hemisphere light to the scene
// const hemiLight = new THREE.HemisphereLight(0xff99ff, 0xaa5500);
// scene.add(hemiLight);

// Add Shapes

// Sphere geometry and material
const size = 0.075;
const geometries = [
  new THREE.BoxGeometry(size, size, size),
  new THREE.SphereGeometry(size, 32, 32),
  new THREE.ConeGeometry(size, size * 2, 32),
  new THREE.CylinderGeometry(size, size, size * 2, 32),
];

const materials = [
  new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: false }),
  new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: false }),
  new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: false }),
  new THREE.MeshBasicMaterial({ color: 0x0000ff, wireframe: false }),
];

const numShapes = 55;
for (let i = 0; i < numShapes; i += 1) {
  // Randomly select a geometry and a material
  const randomGeometry =
    geometries[Math.floor(Math.random() * geometries.length)];
  const randomMaterial =
    materials[Math.floor(Math.random() * materials.length)];

  // Create the shape with the selected geometry and material
  const shape = new THREE.Mesh(randomGeometry, randomMaterial);

  // Calculate position on the tube path
  const p = (i / numShapes + Math.random() * 0.1) % 1;
  const pos = tubeGeo.parameters.path.getPointAt(p);
  pos.x += Math.random() - 0.4;
  pos.y += Math.random() - 0.4;
  shape.position.copy(pos);

  const initialRotation = new THREE.Vector3(
    Math.random() * Math.PI,
    Math.random() * Math.PI,
    Math.random() * Math.PI
  );

  const edges = new THREE.EdgesGeometry(randomGeometry, 0.2);
  const color = new THREE.Color().setHSL(1.0 - p, 1, 0.5);
  const lineMat = new THREE.LineBasicMaterial({ color });
  const shapeLines = new THREE.LineSegments(edges, lineMat);
  shapeLines.position.copy(pos);
  shapeLines.rotation.set(
    initialRotation.x,
    initialRotation.y,
    initialRotation.z
  );

  // scene.add(box);
  scene.add(shapeLines);
}

// Fly through functionality

const updateCamera = (t) => {
  const time = t * 0.08;
  const looptime = 8 * 1000;
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
  composer.render(scene, camera);
  controls.update();
};

animate();

const handleWindowSize = () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
};
window.addEventListener("resize", handleWindowSize, false);
