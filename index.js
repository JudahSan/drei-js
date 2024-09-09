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

// Create a tube geometry from the spline
const tubeGeo = new THREE.TubeGeometry(spline, 222, 0.65, 16, true);
const tubeMat = new THREE.MeshBasicMaterial({
  color: 0x0099ff,
  side: THREE.DoubleSide,
  wireframe: true,
});
const tube = new THREE.Mesh(tubeGeo, tubeMat);

// Create edges geometry
const edgesGeo = new THREE.EdgesGeometry(tubeGeo, 0.2);
const lineMat = new THREE.LineBasicMaterial({ color: 0x00ff00 });
const tubeLines = new THREE.LineSegments(edgesGeo, lineMat);
scene.add(tubeLines);

// Spaceship Geometry and Material
const spaceshipGeometry = new THREE.BoxGeometry(0.2, 0.1, 0.4); // Adjust size to look like a spaceship
const spaceshipMaterial = new THREE.MeshPhongMaterial({ color: 0x5555ff, shininess: 100 }); // Changed material to Phong

// Add 50 spaceships along the spline
const spaceships = [];
for (let i = 0; i < 50; i++) {
    const spaceship = new THREE.Mesh(spaceshipGeometry, spaceshipMaterial);
    
    // Position spaceship along the spline
    const t = i / 50; // Evenly distribute along the path
    const pos = spline.getPointAt(t);
    spaceship.position.copy(pos);

    // Orient spaceship along the path
    const tangent = spline.getTangent(t).normalize();
    const axis = new THREE.Vector3();
    const up = new THREE.Vector3(0, 1, 0);
    axis.crossVectors(up, tangent).normalize();
    const radians = Math.acos(up.dot(tangent));
    spaceship.quaternion.setFromAxisAngle(axis, radians);

    scene.add(spaceship);
    spaceships.push(spaceship);
}

// Lighting
const ambientLight = new THREE.AmbientLight(0x404040, 2); // Added intensity to ambient light
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0xffffff, 1, 100);
pointLight.position.set(5, 5, 5);
scene.add(pointLight);

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
const animate = (time = 0) => {
  requestAnimationFrame(animate);
  updateCamera(time);
  
  // Move spaceships slightly along the path
  spaceships.forEach((spaceship, i) => {
    const t = (i / 50 + (time * 0.00005)) % 1;
    const pos = spline.getPointAt(t);
    spaceship.position.copy(pos);

    // Orient spaceship along the path
    const tangent = spline.getTangent(t).normalize();
    const axis = new THREE.Vector3();
    const up = new THREE.Vector3(0, 1, 0);
    axis.crossVectors(up, tangent).normalize();
    const radians = Math.acos(up.dot(tangent));
    spaceship.quaternion.setFromAxisAngle(axis, radians);
  });

  renderer.render(scene, camera);
  controls.update();
};

animate(); // Start the animation loop

const handleWindowSize = () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
};
window.addEventListener("resize", handleWindowSize, false);
