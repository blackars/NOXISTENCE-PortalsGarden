import * as THREE from 'three';
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

const container = document.getElementById('container');

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xffffff);

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
container.appendChild(renderer.domElement);

// Suelo grande
const floorGeometry = new THREE.PlaneGeometry(100, 100);
const floorMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
const floor = new THREE.Mesh(floorGeometry, floorMaterial);
floor.rotation.x = -Math.PI / 2;
scene.add(floor);

// Grid para referencia visual del suelo
const grid = new THREE.GridHelper(100, 100, 0xffffff, 0xf6f6f6);
scene.add(grid);
// cuando sea necesario, descomentar para ver el grid


// Iluminación
const ambientLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 1);
ambientLight.position.set(0, 20, 0);
scene.add(ambientLight);

const dirLight = new THREE.DirectionalLight(0xffffff, 0.5);
dirLight.position.set(3, 10, 10);
scene.add(dirLight);

// Esfera visible que representa al jugador
const playerGeometry = new THREE.SphereGeometry(0.8, 32, 32);
const playerMaterial = new THREE.MeshStandardMaterial({ color: 0x000000 });
const player = new THREE.Mesh(playerGeometry, playerMaterial);
player.position.set(0, 0.8, 0);
scene.add(player);

// Controles PointerLock para cámara primera persona
const controls = new PointerLockControls(camera, renderer.domElement);
scene.add(controls.object);

// Posición inicial de la cámara (altura ojos humanas)
controls.object.position.set(0, 0, 0);

// Activar pointer lock con click en el canvas
container.addEventListener('click', () => {
  controls.lock();
});

// Estado teclas
const keys = {};

document.addEventListener('keydown', (event) => {
  keys[event.code] = true;
});

document.addEventListener('keyup', (event) => {
  keys[event.code] = false;
});

// Raycaster para detectar clicks desde el centro pantalla
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2(0, 0); // Centro en NDC

// Variable global para modelo Timina
let timinaModel = null;

window.addEventListener('click', () => {
  if (!controls.isLocked) return; // Solo cuando pointerlock activo

  raycaster.setFromCamera(mouse, camera);

  if (timinaModel) {
    const intersects = raycaster.intersectObject(timinaModel, true);
    if (intersects.length > 0) {
      // Abrir modal si se clickea Timina
      openModal();
    }
  }
});

// Loader para GLB
const loader = new GLTFLoader();

// Cargar modelo Timina.glb
loader.load(
  './Timina.glb', // Ajusta la ruta según tu proyecto
  (gltf) => {
    timinaModel = gltf.scene;

    timinaModel.position.set(20, 1, 20); // 45-3-45 es esquina del suelo

    scene.add(timinaModel);
  },
  undefined,
  (error) => {
    console.error('Error cargando Timina.glb:', error);
  }
);

const clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);

  const delta = clock.getDelta();

  if (controls.isLocked === true) {
    const direction = new THREE.Vector3();

    if (keys['KeyW']) direction.z -= 1;
    if (keys['KeyS']) direction.z += 1;
    if (keys['KeyA']) direction.x -= 1;
    if (keys['KeyD']) direction.x += 1;

    direction.normalize();

    if (direction.length() > 0) {
      const moveVector = new THREE.Vector3(direction.x, 0, direction.z);
      moveVector.applyQuaternion(camera.quaternion);
      moveVector.y = 0;

      const speed = 5;
      moveVector.multiplyScalar(speed * delta);

      controls.object.position.add(moveVector);
    }

    player.position.copy(controls.object.position);
    player.position.y = 0.8;
  }

  renderer.render(scene, camera);
}

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

animate();

// --- Modal HTML + Funciones ---

// Crea e inyecta modal al body (puedes moverlo a HTML si quieres)
const modalHTML = `
  <div id="modalOverlay" style="
    position: fixed;
    top: 0; left: 0; right:0; bottom: 0;
    background: rgba(0,0,0,0.6);
    display: none;
    justify-content: center;
    align-items: center;
    z-index: 9999;">
    <div id="modalContent" style="
      background: white;
      padding: 20px;
      border-radius: 8px;
      max-width: 400px;
      text-align: center;
      box-shadow: 0 0 10px black;
    ">
      <h2>Información de Timina</h2>
      <p>Has clickeado sobre el modelo Timina.</p>
      <button id="closeModalBtn">Cerrar</button>
    </div>
  </div>
`;

document.body.insertAdjacentHTML('beforeend', modalHTML);

const modalOverlay = document.getElementById('modalOverlay');
const closeModalBtn = document.getElementById('closeModalBtn');

function openModal() {
  modalOverlay.style.display = 'flex';
  controls.unlock(); // desbloquea el cursor para cerrar modal
}

closeModalBtn.onclick = () => {
  modalOverlay.style.display = 'none';
  controls.lock(); // vuelve a bloquear puntero
};
