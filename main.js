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
scene.add(controls.object);

// Posición inicial de la cámara
camera.position.set(0, 1.6, 5);
controls.object.position.y = 1.6;

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
        const frontVector = new THREE.Vector3(0, 0, -1).applyQuaternion(camera.quaternion);
        const sideVector = new THREE.Vector3(1, 0, 0).applyQuaternion(camera.quaternion);
        
        // Calcular movimiento deseado
        if (keys['KeyW'] || keys['ArrowUp']) direction.add(frontVector);
        if (keys['KeyS'] || keys['ArrowDown']) direction.sub(frontVector);
        if (keys['KeyA'] || keys['ArrowLeft']) direction.sub(sideVector);
        if (keys['KeyD'] || keys['ArrowRight']) direction.add(sideVector);
        
        direction.y = 0;
        if (direction.lengthSq() > 0) direction.normalize();
        
        // Calcular nueva posición
        const currentPosition = new THREE.Vector3().copy(camera.position);
        const moveX = direction.x * moveSpeed * delta;
        const moveZ = -direction.z * moveSpeed * delta;
        
        // Límites del área (mitad del tamaño del suelo)
        const limit = 50;
        const newX = currentPosition.x + moveX;
        const newZ = currentPosition.z + moveZ;
        
        // Aplicar movimiento solo si no se sale de los límites
        if (Math.abs(newX) <= limit) {
            controls.moveRight(moveX);
        }
        if (Math.abs(newZ) <= limit) {
            controls.moveForward(moveZ);
        }
    }
    
    renderer.render(scene, camera);
}

// Mostrar instrucciones si es la primera vez
function showInstructions() {
    if (!localStorage.getItem('hasSeenInstructions')) {
        // Crear contenedor del modal
        const modal = document.createElement('div');
        modal.id = 'instructions-modal';
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 10000;
            background: rgba(0, 0, 0, 0.8);
            backdrop-filter: blur(5px);
        `;

        // Crear iframe para cargar las instrucciones
        const iframe = document.createElement('iframe');
        iframe.src = 'instructions.html';
        iframe.style.cssText = `
            width: 100%;
            height: 100%;
            border: none;
            background: transparent;
        `;
        
        modal.appendChild(iframe);
        document.body.appendChild(modal);

        // Función para cerrar el modal
        const closeModal = () => {
            document.body.removeChild(modal);
            localStorage.setItem('hasSeenInstructions', 'true');
            window.focus();
            // Eliminar el event listener después de cerrar
            window.removeEventListener('message', handleMessage);
        };

        // Manejar mensajes desde el iframe
        const handleMessage = (event) => {
            if (event.data === 'closeInstructions') {
                closeModal();
            }
        };

        // Escuchar mensajes del iframe
        window.addEventListener('message', handleMessage, false);

        // También cerrar con Escape
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') {
                closeModal();
            }
        };
        document.addEventListener('keydown', handleKeyDown);

        // Limpiar event listener cuando se cierre el modal
        modal._cleanup = () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }
}

// Mostrar instrucciones al cargar
showInstructions();

// Manejo de redimensionado
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Activar pointer lock con click en el canvas
container.addEventListener('click', () => {
    if (!controls.isLocked) {
        try {
            const lockPromise = controls.lock();
            if (lockPromise && typeof lockPromise.catch === 'function') {
                lockPromise.catch(err => {
                    console.error('Error al bloquear el puntero:', err);
                });
            }
        } catch (err) {
            console.error('Error al intentar bloquear el puntero:', err);
        }
    }
});

// Iniciar la animación
animate();

// Instrucciones
console.log('Presiona P para alternar el control del ratón');
console.log('Haz clic en la pantalla para habilitar los controles');
