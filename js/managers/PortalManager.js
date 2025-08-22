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
        
        // Actualizar efectos de esfera
        this.updateSphereEffects();
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

    createSphereEffect(config) {
        // Crear la esfera de efecto
        const sphereGeometry = new THREE.SphereGeometry(1.5, 32, 32);
        const sphereMaterial = new THREE.MeshBasicMaterial({
            color: 0x000000,
            transparent: true,
            opacity: 0.3,
            side: THREE.DoubleSide
        });
        
        const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
        sphere.userData = { 
            isPortal: true,
            portalData: config,
            isEffect: true
        };
        
        // Configuración de animación personalizable
        sphere.userData.pulseSpeed = 0.7 + Math.random() * 0.6;  // Velocidad del pulso (0.7 - 1.3)
        sphere.userData.scaleIntensity = 0.25;  // Intensidad del escalado (0.1 = 10%)
        sphere.userData.baseOpacity = 0.35;     // Opacidad base (0-1)
        sphere.userData.opacityIntensity = 0.75; // Intensidad de la opacidad
        
        return sphere;
    }
    
    updateSphereEffects() {
        const time = this.clock.getElapsedTime();
        
        this.portals.forEach(portalData => {
            // Comprueba si es un portal con efecto (para compatibilidad con portales antiguos)
            const effect = portalData.effect || (portalData.userData?.isEffect ? portalData : null);
            
            if (effect) {
                // Parámetros de animación personalizables:
                const pulseSpeed = effect.userData.pulseSpeed || 0.8;  // Velocidad del pulso
                const scaleIntensity = effect.userData.scaleIntensity || 0.15;  // Intensidad del escalado (0.1 = 10%)
                const baseOpacity = effect.userData.baseOpacity || 0.25;  // Opacidad base (0-1)
                const opacityIntensity = effect.userData.opacityIntensity || 0.15;  // Intensidad de la opacidad
                
                // Animación de escala con suavizado
                const scalePulse = Math.sin(time * pulseSpeed) * 0.5 + 0.5; // Normalizado a 0-1
                const targetScale = 1.0 + (scalePulse * scaleIntensity);
                
                // Animación de opacidad con desfase para un efecto más orgánico
                const opacityPulse = Math.sin(time * (pulseSpeed * 0.8) + 1.0) * 0.5 + 0.5;
                const targetOpacity = baseOpacity + (opacityPulse * opacityIntensity);
                
                // Aplicar las animaciones
                effect.scale.setScalar(targetScale);
                effect.material.opacity = Math.min(1, Math.max(0, targetOpacity)); // Asegurar valores entre 0 y 1
            }
        });
    }
    
    loadModel(config) {
        console.log(`Cargando modelo: ${config.id} desde ${config.modelPath}`);
        
        return new Promise((resolve, reject) => {
            this.loader.load(
                config.modelPath,
                (gltf) => {
                    console.log(`✅ Modelo cargado: ${config.id}`);
                    
                    // Crear un grupo para el portal y sus efectos
                    const portalGroup = new THREE.Group();
                    portalGroup.position.set(
                        config.position.x,
                        config.position.y,
                        config.position.z
                    );
                    
                    portalGroup.rotation.set(
                        config.rotation?.x || 0,
                        config.rotation?.y || 0,
                        config.rotation?.z || 0
                    );
                    
                    const scale = config.scale || 1;
                    portalGroup.scale.set(scale, scale, scale);
                    
                    // Configurar el modelo
                    const model = gltf.scene;
                    
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
                    
                    // Crear y añadir la esfera de efecto
                    const sphereEffect = this.createSphereEffect(config);
                    
                    // Añadir modelo y efecto al grupo
                    portalGroup.add(model);
                    portalGroup.add(sphereEffect);
                    
                    // Añadir el grupo a la escena
                    this.scene.add(portalGroup);
                    
                    // Guardar referencias
                    const portalData = {
                        group: portalGroup,
                        model: model,
                        effect: sphereEffect,
                        config: config
                    };
                    
                    this.portals.set(config.id, portalData);
                    console.log('Portal con efecto agregado a la escena:', portalData);
                    
                    // Resolver la promesa con el portal cargado
                    resolve(portalData);
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
        this.portals.forEach(portalData => {
            // Asegurarse de que sea un grupo de portal
            const group = portalData.group || portalData;
            group.traverse(child => {
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
        this.portals.forEach(portalData => {
            const portal = portalData.group || portalData;
            this.scene.remove(portal);
            
            // Función para limpiar objetos recursivamente
            const cleanObject = (object) => {
                if (!object) return;
                
                if (object.geometry) object.geometry.dispose();
                
                if (object.material) {
                    if (Array.isArray(object.material)) {
                        object.material.forEach(m => m.dispose());
                    } else {
                        object.material.dispose();
                    }
                }
                
                // Limpiar hijos si los hay
                if (object.children) {
                    object.children.forEach(child => cleanObject(child));
                }
            };
            
            // Limpiar el portal y todos sus hijos
            cleanObject(portal);
            
            // Limpiar animaciones
            const mixer = (portalData.model && portalData.model.userData.mixer) || 
                         (portal.userData && portal.userData.mixer);
            
            if (mixer) {
                const index = this.mixers.indexOf(mixer);
                if (index > -1) {
                    this.mixers.splice(index, 1);
                }
            }
        });
        
        this.portals.clear();
        this.mixers = [];
    }
}