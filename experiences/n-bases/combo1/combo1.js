import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

let scene, camera, renderer, controls, terrain, player, mixer;
let clock = new THREE.Clock();
let raycaster = new THREE.Raycaster();
let collisionObjects = [];
let terrainBounds = { minX: -100, maxX: 100, minZ: -100, maxZ: 100 };

const playerConfig = { radius: 1.0, height: 2, speed: 10, jumpForce: 15, gravity: -30, slopeLimit: 0.5, stepHeight: 0.3, skinWidth: 0.1 };
const playerState = { velocity: new THREE.Vector3(), direction: new THREE.Vector3(), canJump: false };
const keys = {};
const tempVec = new THREE.Vector3();
const tempCamDir = new THREE.Vector3();
const loader = new GLTFLoader();

function init() {
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xffffff);

  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(0, 50, 50);

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  document.body.appendChild(renderer.domElement);

  setupLights();
  setupControls();
  loadTerrain();
  setupEventListeners();
}

function setupLights() {
  const sunLight = new THREE.DirectionalLight(0xfff4e6, 1);
  sunLight.position.set(100, 200, 100);
  sunLight.castShadow = true;
  sunLight.shadow.mapSize.set(2048, 2048);
  sunLight.shadow.camera.near = 0.5;
  sunLight.shadow.camera.far = 500;
  sunLight.shadow.camera.left = -100;
  sunLight.shadow.camera.right = 100;
  sunLight.shadow.camera.top = 100;
  sunLight.shadow.camera.bottom = -100;
  sunLight.shadow.bias = -0.0001;
  scene.add(sunLight);

  const fillLight = new THREE.DirectionalLight(0xffffff, 0.3);
  fillLight.position.set(-50, -100, -50);
  scene.add(fillLight);

  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambientLight);

  const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
  dirLight.position.set(50, 200, 100);
  dirLight.castShadow = true;
  dirLight.shadow.camera.top = 180;
  dirLight.shadow.camera.bottom = -100;
  dirLight.shadow.camera.left = -120;
  dirLight.shadow.camera.right = 120;
  scene.add(dirLight);
}

function setupControls() {
  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.screenSpacePanning = false;
  controls.minDistance = 5;
  controls.maxDistance = 500;
  controls.maxPolarAngle = Math.PI / 2;
}

function loadTerrain() {
  loader.load('/assets/models/max_canon.glb', function (gltf) {
    terrain = gltf.scene;
    terrain.traverse(node => {
      if (node.isMesh) {
        node.castShadow = true;
        node.receiveShadow = true;
        if (node.geometry) {
          node.updateMatrixWorld();
          if (!node.geometry.boundingBox) node.geometry.computeBoundingBox();
          collisionObjects.push(node);
        }
      }
    });
    scene.add(terrain);
    const terrainBox = new THREE.Box3().setFromObject(terrain);
    terrainBounds = { minX: terrainBox.min.x, maxX: terrainBox.max.x, minZ: terrainBox.min.z, maxZ: terrainBox.max.z };
    const terrainCenter = new THREE.Vector3();
    terrainBox.getCenter(terrainCenter);
    loadPlayerModel(terrainCenter);
  });
}

function loadPlayerModel(position) {
  loader.load('/assets/models/beetle.glb', function(gltf) {
    player = gltf.scene;
    mixer = new THREE.AnimationMixer(player);
    if (gltf.animations.length > 0) {
      const action = mixer.clipAction(gltf.animations[0]);
      action.play();
    }

    player.traverse(node => {
      if (node.isMesh) {
        node.castShadow = true;
        node.receiveShadow = true;
      }
    });
    player.position.copy(position);
    player.position.y = 50;

    playerState.velocity.set(0, 0, 0);
    playerState.direction.set(0, 0, 0);
    playerState.canJump = false;
    scene.add(player);

    camera.position.set(0, 50, 50);
    camera.lookAt(0, 0, 0);
    if (controls) { controls.target.set(0, 0, 0); controls.update(); }
  });
}

function setupEventListeners() {
  document.addEventListener('keydown', e => { keys[e.key.toLowerCase()] = true; if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) e.preventDefault(); });
  document.addEventListener('keyup', e => { keys[e.key.toLowerCase()] = false; });
  window.addEventListener('resize', onWindowResize, false);
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function checkGroundCollision() {
  raycaster.ray.origin.copy(player.position);
  raycaster.ray.direction.set(0, -1, 0);
  raycaster.far = 50;
  const intersects = raycaster.intersectObjects(collisionObjects, true);
  if (intersects.length > 0) {
    const hitPoint = intersects[0].point;
    const distance = player.position.y - hitPoint.y;
    if (distance <= playerConfig.radius * 1.1) {
      player.position.y = hitPoint.y + playerConfig.radius;
      playerState.velocity.y = 0;
      playerState.canJump = true;
      return true;
    }
  }
  playerState.canJump = false;
  return false;
}

function keepPlayerInBounds() {
  const adjustedMinX = terrainBounds.minX + playerConfig.radius;
  const adjustedMaxX = terrainBounds.maxX - playerConfig.radius;
  const adjustedMinZ = terrainBounds.minZ + playerConfig.radius;
  const adjustedMaxZ = terrainBounds.maxZ - playerConfig.radius;
  player.position.x = Math.max(adjustedMinX, Math.min(adjustedMaxX, player.position.x));
  player.position.z = Math.max(adjustedMinZ, Math.min(adjustedMaxZ, player.position.z));
  if (player.position.y < -50) {
    player.position.set((terrainBounds.minX + terrainBounds.maxX) / 2, 50, (terrainBounds.minZ + terrainBounds.maxZ) / 2);
    playerState.velocity.set(0, 0, 0);
  }
}

function updatePlayer(delta) {
  if (!player) return;
  if (mixer) mixer.update(delta);

  playerState.velocity.y += playerConfig.gravity * delta;
  playerState.velocity.y = Math.max(playerState.velocity.y, -20);

  tempVec.set(0, 0, 0);
  if (keys['w'] || keys['arrowup']) tempVec.z = -1;
  if (keys['s'] || keys['arrowdown']) tempVec.z = 1;
  if (keys['a'] || keys['arrowleft']) tempVec.x = -1;
  if (keys['d'] || keys['arrowright']) tempVec.x = 1;

  if (tempVec.length() > 0) {
    tempVec.normalize();
    camera.getWorldDirection(tempCamDir);
    tempCamDir.y = 0; tempCamDir.normalize();
    const angle = Math.atan2(tempCamDir.x, tempCamDir.z);
    const moveX = tempVec.x * Math.cos(angle) - tempVec.z * Math.sin(angle);
    const moveZ = tempVec.x * Math.sin(angle) + tempVec.z * Math.cos(angle);
    player.position.x += moveX * playerConfig.speed * delta;
    player.position.z += moveZ * playerConfig.speed * delta;
  }

  const isOnGround = checkGroundCollision();
  if (!isOnGround) player.position.y += playerState.velocity.y * delta;
  if ((keys[' '] || keys['space']) && isOnGround) { playerState.velocity.y = playerConfig.jumpForce; player.position.y += 0.1; }

  if (isOnGround) { playerState.velocity.x *= 0.9; playerState.velocity.z *= 0.9; }
  keepPlayerInBounds();
  if (controls) controls.update();
}

function animate() {
  const delta = Math.min(clock.getDelta(), 0.05);
  updatePlayer(delta);
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}

document.addEventListener('DOMContentLoaded', () => { init(); animate(); });
