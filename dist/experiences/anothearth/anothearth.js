import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';


// Variables globales
let scene, camera, renderer, container;
let modelScale = 1.0;
let solarSystem = null;
let mixer = null;
let clock = new THREE.Clock();
let animationSpeed = 1.0; // <- Controlado por el slider de Timepass
let isRotationPaused = false;
let isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

// Variables para doble tap
let lastTap = 0;
let tapTimeout;
const DOUBLE_TAP_DELAY = 300; // ms

// Variables para el efecto parallax
let mouseX = 0, mouseY = 0;
let targetRotationX = 0, targetRotationY = 0;
const rotationIntensity = 0.2;

// Variables para el zoom
let targetZoom = 2.0;
const minZoom = 0.1;
const maxZoom = 25;

// Inicializar la escena
function init() {
  scene = new THREE.Scene();

  // Cámara
  camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 2000);
  camera.position.set(0, 0, 150);

  // Renderer
  container = document.getElementById('container');
  renderer = new THREE.WebGLRenderer({
    antialias: true,
    powerPreference: 'high-performance',
    logarithmicDepthBuffer: true
  });
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  container.appendChild(renderer.domElement);

  // Luces
  scene.add(new THREE.AmbientLight(0x404040, 0.8));

  const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
  directionalLight.position.set(10, 20, 10);
  scene.add(directionalLight);

  const pointLight = new THREE.PointLight(0xffffff, 1, 100);
  pointLight.position.set(5, 10, -5);
  scene.add(pointLight);

  const hemisphereLight = new THREE.HemisphereLight(0xffffbb, 0x080820, 0.6);
  scene.add(hemisphereLight);

  // Estrellas
  createSkybox();

  // Eventos
  window.addEventListener('resize', onWindowResize);
  window.addEventListener('wheel', onMouseWheel, { passive: false });
  window.addEventListener('keydown', onKeyDown);
  window.addEventListener('click', (e) => handleModelClick(e, false));
  window.addEventListener('dblclick', (e) => handleModelClick(e, true));
  window.addEventListener('mousemove', onMouseMove);
  window.addEventListener('mouseup', onPointerUp);

  // Touch
  window.addEventListener('touchend', handleTouchEnd, { passive: false });
  window.addEventListener('touchmove', onTouchMove, { passive: false });

  // 🎚️ Control del slider de velocidad (Timepass)
  const speedControl = document.getElementById('animationSpeed');
  if (speedControl) {
    speedControl.addEventListener('input', (e) => {
      animationSpeed = parseFloat(e.target.value);
    });
  }

  // Modelo
  loadModel();

  animate();
}

// Skybox de estrellas
function createSkybox() {
  const starsGeometry = new THREE.BufferGeometry();
  const starCount = 5000;

  const positions = new Float32Array(starCount * 3);
  const colors = new Float32Array(starCount * 3);

  const starColors = [0xffffff, 0x7fb3ff, 0x9d7bff, 0x5d8aff, 0xc17fff];

  for (let i = 0; i < starCount; i++) {
    const i3 = i * 3;
    const radius = 2000 + Math.random() * 200;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);

    positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
    positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
    positions[i3 + 2] = radius * Math.cos(phi);

    const color = new THREE.Color(starColors[Math.floor(Math.random() * starColors.length)]);
    colors[i3] = color.r;
    colors[i3 + 1] = color.g;
    colors[i3 + 2] = color.b;
  }

  starsGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  starsGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  const starsMaterial = new THREE.PointsMaterial({
    size: 1,
    sizeAttenuation: true,
    vertexColors: true,
    transparent: true,
    opacity: 0.8,
    blending: THREE.AdditiveBlending
  });

  const starField = new THREE.Points(starsGeometry, starsMaterial);
  scene.add(starField);
}

// Cargar modelo
function loadModel() {
  const loader = new GLTFLoader();
  const modelPath = '/assets/models/AnothEarth.glb';

  loader.load(modelPath, (gltf) => {
    solarSystem = gltf.scene;

    // Limpiar helpers/luces del modelo
    solarSystem.traverse((child) => {
      if (child.isLine || child.isLight) child.visible = false;
    });

    scene.add(solarSystem);

    // Animaciones
    if (gltf.animations && gltf.animations.length > 0) {
      mixer = new THREE.AnimationMixer(solarSystem);
      gltf.animations.forEach((clip) => {
        mixer.clipAction(clip).play();
      });
    }

    // Centrar modelo
    const box = new THREE.Box3().setFromObject(solarSystem);
    const center = box.getCenter(new THREE.Vector3());
    solarSystem.position.set(-center.x, -center.y, -center.z);

    updateModelScale();

    // Ajustar cámara
    const size = box.getSize(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z);
    const distance = maxDim * 10;
    camera.position.set(0, 0, distance);
    camera.near = 0.1;
    camera.far = distance * 5;
    camera.updateProjectionMatrix();
  });
}

// Controles
function onWindowResize() {
  camera.aspect = container.clientWidth / container.clientHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(container.clientWidth, container.clientHeight);
}

function onMouseWheel(event) {
  event.preventDefault();
  if (event.ctrlKey) {
    const zoomFactor = event.deltaY > 0 ? 0.9 : 1.1;
    camera.position.multiplyScalar(zoomFactor);
  } else {
    targetZoom += event.deltaY * -0.001;
    targetZoom = Math.max(minZoom, Math.min(maxZoom, targetZoom));
  }
}

function onKeyDown(event) {
  if (event.code === 'Space') {
    event.preventDefault();
    isRotationPaused = !isRotationPaused;
  }
}

function handleModelClick(event, isDouble = false) {
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();

  const clientX = event.clientX || (event.touches && event.touches[0].clientX);
  const clientY = event.clientY || (event.touches && event.touches[0].clientY);

  if (clientX === undefined || clientY === undefined) return;

  mouse.x = (clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);

  if (!solarSystem) return;

  const intersects = raycaster.intersectObject(solarSystem, true);
  if (intersects.length === 0) return;

  if (isDouble) {
    isRotationPaused = !isRotationPaused;
  } else {
    document.getElementById('planetInfo').classList.toggle('visible');
  }
}

function onMouseMove(event) {
  if (isRotationPaused) {
    const targetX = (event.clientX / window.innerWidth) * 2 - 1;
    const targetY = (event.clientY / window.innerHeight) * 2 - 1;
    mouseX += (targetX - mouseX) * 0.1;
    mouseY += (targetY - mouseY) * 0.1;
  }
}

function onTouchMove(event) {
  if (isRotationPaused && event.touches.length > 0) {
    const touch = event.touches[0];
    mouseX = (touch.clientX / window.innerWidth) * 2 - 1;
    mouseY = (touch.clientY / window.innerHeight) * 2 - 1;
  }
}

function onPointerUp() {
  if (isRotationPaused) {
    mouseX = 0;
    mouseY = 0;
  }
}

function handleTouchEnd(e) {
  const currentTime = new Date().getTime();
  const tapLength = currentTime - lastTap;

  clearTimeout(tapTimeout);

  if (tapLength < DOUBLE_TAP_DELAY && tapLength > 0) {
    handleModelClick(e, true);
  } else {
    tapTimeout = setTimeout(() => {
      handleModelClick(e, false);
    }, DOUBLE_TAP_DELAY);
  }

  lastTap = currentTime;
  onPointerUp(e);
}

// Escalado
function updateModelScale() {
  if (solarSystem) {
    solarSystem.scale.set(modelScale, modelScale, modelScale);
  }
}

// Animación
function animate() {
  requestAnimationFrame(animate);

  if (mixer && !isRotationPaused) {
    const delta = clock.getDelta() * animationSpeed; // 🔥 el slider acelera/frena el tiempo
    mixer.update(delta);
  }

  // Zoom suavizado
  camera.zoom += (targetZoom - camera.zoom) * 0.1;

  // Parallax
  if (isRotationPaused && solarSystem) {
    targetRotationX = -mouseY * rotationIntensity * 0.5;
    targetRotationY = mouseX * rotationIntensity * 0.5;
    solarSystem.rotation.x = targetRotationX;
    solarSystem.rotation.y = targetRotationY;
  }

  camera.updateProjectionMatrix();
  renderer.render(scene, camera);
}

init();
