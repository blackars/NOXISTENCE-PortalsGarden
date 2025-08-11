import * as THREE from 'three';
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { PortalManager } from './js/managers/PortalManager.js';
import { Modal } from './js/ui/Modal.js';
import { PORTAL_CONFIG } from './js/config/portals.js';

// Variables para la animación del grid
let gridIntensity = 1.0;
const gridPulseSpeed = 0.5; // Velocidad de la animación del grid

// Configuración básica de Three.js
const container = document.getElementById('container');
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xffffff); // Fondo blanco

// Configuración de cámara
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.name = 'camera';

// Configuración del renderizador
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
container.appendChild(renderer.domElement);

// Suelo (invisible, solo para sombras)
const floorGeometry = new THREE.PlaneGeometry(100, 100);
const floorMaterial = new THREE.MeshStandardMaterial({ 
    color: 0xffffff,
    roughness: 0.8,
    metalness: 0.0,
    transparent: true,
    opacity: 0.0
});
const floor = new THREE.Mesh(floorGeometry, floorMaterial);
floor.rotation.x = -Math.PI / 2;
floor.receiveShadow = true;
scene.add(floor);

// Grid de referencia con animación
const gridSize = 100;
const gridDivisions = 50;
const gridColor1 = new THREE.Color(0x000000);
const gridColor2 = new THREE.Color(0x000000);

const gridHelper = new THREE.GridHelper(gridSize, gridDivisions, gridColor1, gridColor2);
gridHelper.material.opacity = 0.5;
gridHelper.material.transparent = true;
gridHelper.position.y = 0.01;
scene.add(gridHelper);

// Iluminación suave
const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight.position.set(1, 1, 1);
directionalLight.castShadow = true;
scene.add(directionalLight);

// Controles
const controls = new PointerLockControls(camera, renderer.domElement);
scene.add(controls.getObject());

// Posición inicial de la cámara
camera.position.set(0, 1.6, 5);
controls.getObject().position.y = 1.6;

// Variables de movimiento
const moveSpeed = 5;
const keys = {};

// Eventos de teclado
document.addEventListener('keydown', (event) => {
    keys[event.code] = true;
    
    // Tecla P para alternar pointer lock
    if (event.code === 'KeyP') {
        if (controls.isLocked) {
            controls.unlock();
        } else {
            controls.lock();
        }
    }
}, false);

document.addEventListener('keyup', (event) => {
    keys[event.code] = false;
}, false);

// Inicializar el modal
const modal = new Modal(controls);

// Inicializar el gestor de portales
const portalManager = new PortalManager(scene, (portalData) => {
    console.log('Portal clickeado:', portalData);
    modal.show(portalData);
});

// Pasar los controles y la cámara al PortalManager
portalManager.setControls(controls);
portalManager.setCamera(camera);

// Asegurarse de que el PortalManager reciba los eventos de clic
container.addEventListener('click', (event) => {
    portalManager.handleClick(event);
});

// Cargar portales
portalManager.loadPortals(PORTAL_CONFIG);

// Raycaster para interacciones
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2(0, 0);

// Cargar modelo Timina.glb como un portal
const loader = new GLTFLoader();

const clock = new THREE.Clock();

// Función de animación
function animate() {
    requestAnimationFrame(animate);
    
    const delta = clock.getDelta();
    
    // Animación del grid (pulso suave de blanco a negro en 5 segundos)
    gridIntensity = 0.5 + 0.5 * Math.sin(clock.elapsedTime * gridPulseSpeed);
    gridHelper.material.opacity = gridIntensity * 0.5; // Rango de 0.25 a 0.75 de opacidad
    
    // Actualizar colores del grid
    const intensity = gridIntensity * 0.8 + 0.2; // Mantener un mínimo de brillo
    gridHelper.material.color.setRGB(intensity, intensity, intensity);
    
    // Movimiento del jugador
    if (controls.isLocked) {
        const direction = new THREE.Vector3();
        const frontVector = new THREE.Vector3(0, 0, -1).applyQuaternion(controls.getObject().quaternion);
        const sideVector = new THREE.Vector3(1, 0, 0).applyQuaternion(controls.getObject().quaternion);
        
        if (keys['KeyW'] || keys['ArrowUp']) direction.add(frontVector);
        if (keys['KeyS'] || keys['ArrowDown']) direction.sub(frontVector);
        if (keys['KeyA'] || keys['ArrowLeft']) direction.sub(sideVector);
        if (keys['KeyD'] || keys['ArrowRight']) direction.add(sideVector);
        
        direction.y = 0;
        if (direction.lengthSq() > 0) direction.normalize();
        
        controls.moveRight(direction.x * moveSpeed * delta);
        controls.moveForward(-direction.z * moveSpeed * delta);
    }
    
    renderer.render(scene, camera);
}

// Manejo de redimensionado
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Activar pointer lock con click en el canvas
container.addEventListener('click', () => {
    if (!controls.isLocked) {
        controls.lock().catch(err => {
            console.error('Error al bloquear el puntero:', err);
        });
    }
});

// Iniciar la animación
animate();

// Instrucciones
console.log('Presiona P para alternar el control del ratón');
console.log('Haz clic en la pantalla para habilitar los controles');
