import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export class PortalManager {
    constructor(scene, onPortalClick) {
        console.log('Inicializando PortalManager...');
        this.scene = scene;
        this.onPortalClick = onPortalClick;
        this.portals = new Map();
        this.loader = new GLTFLoader();
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();
        this.controls = null;
        this.camera = null;
        this.mixers = []; // Almacenar mixers de animación
        this.clock = new THREE.Clock(); // Reloj para las animaciones
        
        // Configurar manejador de errores
        this.loader.manager.onError = (url) => {
            console.error('Error cargando recurso:', url);
        };
        
        // Para manejar el click
        this.handleClick = this.handleClick.bind(this);
        
        // Iniciar el bucle de animación
        this.animate();
    }
    
    // Actualizar animaciones
    animate() {
        requestAnimationFrame(() => this.animate());
        const delta = this.clock.getDelta();
        
        // Actualizar todos los mixers de animación
        for (const mixer of this.mixers) {
            mixer.update(delta);
        }
    }
    
    setControls(controls) {
        this.controls = controls;
        return this;
    }
    
    setCamera(camera) {
        this.camera = camera;
        return this;
    }

    async loadPortals(portalsConfig) {
        for (const config of portalsConfig) {
            console.log(`Cargando portal: ${config.id} desde ${config.modelPath}`);
            this.loadModel(config);
        }
    }

    createMarker(config) {
        const geometry = new THREE.BoxGeometry(1, 1, 1);
        const material = new THREE.MeshBasicMaterial({ 
            color: 0x00ff00,
            wireframe: true,
            transparent: true,
            opacity: 0.8
        });
        const marker = new THREE.Mesh(geometry, material);
        marker.position.set(config.position.x, config.position.y, config.position.z);
        marker.scale.set(0.5, 0.5, 0.5);
        marker.userData = { 
            isPortal: true, 
            portalData: config,
            isPlaceholder: true
        };
        return marker;
    }

    loadModel(config) {
        console.log(`Cargando modelo: ${config.id} desde ${config.modelPath}`);
        
        return new Promise((resolve, reject) => {
            this.loader.load(
                config.modelPath,
                (gltf) => {
                    console.log(`✅ Modelo cargado: ${config.id}`);
                    
                    // Configurar el modelo
                    const model = gltf.scene;
                    model.position.set(
                        config.position.x,
                        config.position.y,
                        config.position.z
                    );
                    
                    model.rotation.set(
                        config.rotation?.x || 0,
                        config.rotation?.y || 0,
                        config.rotation?.z || 0
                    );
                    
                    const scale = config.scale || 1;
                    model.scale.set(scale, scale, scale);
                    
                    // Configurar animaciones si existen
                    if (gltf.animations && gltf.animations.length > 0) {
                        console.log(`🔍 Se encontraron ${gltf.animations.length} animaciones`);
                        
                        // Crear un mixer para las animaciones
                        const mixer = new THREE.AnimationMixer(model);
                        this.mixers.push(mixer);
                        
                        // Reproducir todas las animaciones
                        gltf.animations.forEach((clip) => {
                            console.log(`▶️ Reproduciendo animación: ${clip.name}`);
                            const action = mixer.clipAction(clip);
                            action.play();
                        });
                        
                        // Guardar referencia al mixer para actualizaciones
                        model.userData.mixer = mixer;
                    } else {
                        console.log('ℹ️ No se encontraron animaciones en el modelo');
                    }
                    
                    // Hacer que el modelo sea interactivo
                    model.traverse(child => {
                        if (child.isMesh) {
                            child.castShadow = true;
                            child.receiveShadow = true;
                            child.userData = { 
                                isPortal: true,
                                portalData: config
                            };
                        }
                    });
                    
                    this.scene.add(model);
                    this.portals.set(config.id, model);
                    console.log('Modelo agregado a la escena:', model);
                    
                    // Resolver la promesa con el modelo cargado
                    resolve(model);
                },
                // Progreso de carga
                (xhr) => {
                    console.log(`${(xhr.loaded / xhr.total * 100)}% cargado`);
                },
                // Manejo de errores
                (error) => {
                    console.error('❌ Error al cargar el modelo:', error);
                    console.error('Ruta del error:', config.modelPath);
                    reject(error);
                    
                    // Crear un marcador de respaldo si falla la carga
                    console.log('Creando marcador de respaldo...');
                    this.createFallbackPortal(config);
                }
            );
        });
    }

    createFallbackPortal(config) {
        const geometry = new THREE.BoxGeometry(2, 2, 0.2);
        const material = new THREE.MeshBasicMaterial({ 
            color: 0x00ff00,
            transparent: true,
            opacity: 0.7
        });
        const portal = new THREE.Mesh(geometry, material);
        
        portal.position.set(config.position.x, config.position.y || 1, config.position.z);
        portal.userData = {
            id: config.id,
            name: config.name,
            description: config.description || 'Portal de ejemplo',
            thumbnail: config.thumbnail || 'https://via.placeholder.com/300',
            isPortal: true
        };
        
        this.portals.set(config.id, portal);
        this.scene.add(portal);
        console.log(`Portal de respaldo creado para: ${config.id}`);
    }

    handleClick(event) {
        if (!this.camera) return;

        // Usar el centro de la pantalla (0,0) para el raycaster
        this.raycaster.setFromCamera(new THREE.Vector2(0, 0), this.camera);
        
        // Obtener todos los objetos de portal
        const portalObjects = [];
        this.portals.forEach(portal => {
            portal.traverse(child => {
                if (child.isMesh) {
                    portalObjects.push(child);
                }
            });
        });
        
        // Verificar intersecciones
        const intersects = this.raycaster.intersectObjects(portalObjects, true);
        
        if (intersects.length > 0) {
            const clickedObject = intersects[0].object;
            if (clickedObject.userData.isPortal && this.onPortalClick) {
                this.onPortalClick(clickedObject.userData.portalData);
                // Desbloquear el puntero para permitir interactuar con el modal
                if (this.controls && this.controls.isLocked) {
                    this.controls.unlock();
                }
            }
        }
    }

    getPortalById(id) {
        return this.portals.get(id);
    }

    cleanup() {
        // Limpiar event listeners
        document.removeEventListener('click', this.handleClick, false);
        
        // Eliminar portales de la escena
        this.portals.forEach(portal => {
            this.scene.remove(portal);
            if (portal.traverse) {
                portal.traverse(child => {
                    if (child.geometry) child.geometry.dispose();
                    if (child.material) {
                        if (Array.isArray(child.material)) {
                            child.material.forEach(m => m.dispose());
                        } else {
                            child.material.dispose();
                        }
                    }
                });
            }
            
            // Limpiar animaciones
            if (portal.userData.mixer) {
                const index = this.mixers.indexOf(portal.userData.mixer);
                if (index > -1) {
                    this.mixers.splice(index, 1);
                }
            }
        });
        
        this.portals.clear();
        this.mixers = [];
    }
}