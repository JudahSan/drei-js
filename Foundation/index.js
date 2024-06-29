import * as THREE from "three";
import { OrbitControls } from "jsm/controls/OrbitControls.js"

// Initialize the renderer, camera, and scene

// Renderer

const w = window.innerWidth;
const h = window.innerHeight;
const renderer = new THREE.WebGLRenderer({ antialias: true });
// Set the renderer's size to the width and height of the window
renderer.setSize(w, h);
document.body.appendChild(renderer.domElement);

// Camera

const fov = 60; // Field of view
const aspect = w / h; // Aspect ratio
const near = 0.4; // Near clipping plane
const far = 10; // Far clipping plane
const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
camera.position.z = 4; // Set the camera's position on the z-axis

// Scene

const scene = new THREE.Scene();

// Orbit controls for the camera
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; // Enable damping (inertia)
controls.dampingFactor = 0.01; // Damping factor

// Create geometry and material for a mesh
const geo = new THREE.IcosahedronGeometry(5.0, 2);
const mat = new THREE.MeshStandardMaterial({
  color: 0x00a1ff,
  flatShading: true,
});
const mesh = new THREE.Mesh(geo, mat); // Combine geometry and material into a mesh
scene.add(mesh);

// Create and add a wireframe material to the mesh
const wireMat = new THREE.MeshStandardMaterial({
  color: 0xffffff,
  wireframe: true,
});
const wireMesh = new THREE.Mesh(geo, wireMat);
wireMesh.scale.setScalar(1.001); // Slightly enlarge the wireframe to prevent z-fighting
mesh.add(wireMesh);

// Add hemisphere light to the scene
const hemiLight = new THREE.HemisphereLight(0xff99ff, 0xaa5500);
scene.add(hemiLight);

// Animation loop
const animate = (t = 0) => {
  console.log(t);
  requestAnimationFrame(animate);
  mesh.rotation.y = t * 0.0001; // Rotate the mesh over time
  renderer.render(scene, camera); // Render the scene from the perspective of the camera
  controls.update(); // Update the controls
};

animate();
