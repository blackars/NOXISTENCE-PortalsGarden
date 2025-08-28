// deepspace.js
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export class DeepSpaceSimulator {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.scene = new THREE.Scene();

        this.simulationTime = 6; 
        this.elapsedTime = 0;
        this.targetActivated = false; // Track if target circle is active

        this.camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        this.camera.position.set(0, 2, 15);
        this.camera.lookAt(0, 0, 0);

        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.container.appendChild(this.renderer.domElement);

        this.loadBackground();

        this.ship = null;
        this.meteorites = [];
        this.asteroidModels = [];
        this.loadShip();
        this.loadAsteroidModels();

        const ambientLight = new THREE.AmbientLight(0xffffff, 0.15);
        this.scene.add(ambientLight);

        this.targetCircle = this.createTargetCircle();
        this.scene.add(this.targetCircle);
        this.targetCircle.visible = false;

        this.keys = { w: false, a: false, s: false, d: false };
        window.addEventListener('keydown', (e) => this.onKeyDown(e), false);
        window.addEventListener('keyup', (e) => this.onKeyUp(e), false);
        window.addEventListener('resize', () => this.onWindowResize(), false);

        this.collisionFlash = document.createElement('div');
        this.collisionFlash.style.position = 'absolute';
        this.collisionFlash.style.top = '0';
        this.collisionFlash.style.left = '0';
        this.collisionFlash.style.width = '100%';
        this.collisionFlash.style.height = '100%';
        this.collisionFlash.style.backgroundColor = 'red';
        this.collisionFlash.style.opacity = '0';
        this.collisionFlash.style.pointerEvents = 'none';
        this.collisionFlash.style.transition = 'opacity 0.2s';
        this.container.appendChild(this.collisionFlash);

        this.lastTime = performance.now();
        this.animate();
    }

    loadBackground() {
        const loader = new GLTFLoader();
        loader.load(
            '/assets/models/skybox.glb',
            (gltf) => {
                const skybox = gltf.scene;
                
                // Aplicar material BackSide a todos los meshes
                skybox.traverse((child) => {
                    if (child.isMesh) {
                        if (Array.isArray(child.material)) {
                            child.material.forEach(mat => {
                                mat.side = THREE.BackSide;
                            });
                        } else {
                            child.material.side = THREE.BackSide;
                        }
                    }
                });
                
                // Escalar el skybox para que sea lo suficientemente grande
                skybox.scale.set(500, 500, 500);
                this.scene.add(skybox);
            },
            undefined,
            (error) => {
                console.error('Error loading skybox, using fallback:', error);
                this.createFallbackSkybox();
            }
        );
    }

    createFallbackSkybox() {
        // Crear una esfera grande como skybox de respaldo
        const geometry = new THREE.SphereGeometry(500, 32, 32);
        
        // Crear material con textura estrellada
        const canvas = document.createElement('canvas');
        canvas.width = 2048;
        canvas.height = 1024;
        const context = canvas.getContext('2d');
        
        // Fondo espacial oscuro
        const gradient = context.createLinearGradient(0, 0, 0, canvas.height);
        gradient.addColorStop(0, '#000000');
        gradient.addColorStop(1, '#000033');
        context.fillStyle = gradient;
        context.fillRect(0, 0, canvas.width, canvas.height);
        
        // Añadir estrellas
        for (let i = 0; i < 2000; i++) {
            const x = Math.random() * canvas.width;
            const y = Math.random() * canvas.height;
            const size = Math.random() * 1.5;
            const brightness = 0.2 + Math.random() * 0.8;
            
            context.fillStyle = `rgba(255, 255, 255, ${brightness})`;
            context.beginPath();
            context.arc(x, y, size, 0, Math.PI * 2);
            context.fill();
        }
        
        // Crear textura desde el canvas
        const texture = new THREE.CanvasTexture(canvas);
        const material = new THREE.MeshBasicMaterial({
            map: texture,
            side: THREE.BackSide
        });
        
        // Crear skybox
        const skybox = new THREE.Mesh(geometry, material);
        this.scene.add(skybox);
    }

    loadShip() {
        const createFallbackShip = () => {
            const geometry = new THREE.ConeGeometry(1, 2, 4);
            const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
            this.ship = new THREE.Mesh(geometry, material);
            this.ship.rotation.x = Math.PI / 2; 
            this.ship.position.set(0, -window.innerHeight * 0.3 / 100, 0);
            this.scene.add(this.ship);
        };

        try {
            const loader = new GLTFLoader();
            loader.load('/assets/models/ship.glb', (gltf) => {
                this.ship = gltf.scene;
                this.ship.scale.set(0.1, 0.1, 0.1);
                this.ship.rotation.y = Math.PI / 2; 

                this.ship.position.set(0, -window.innerHeight * 0.3 / 100, 0);
                this.scene.add(this.ship);
            }, undefined, createFallbackShip);
        } catch {
            createFallbackShip();
        }
    }

    loadAsteroidModels() {
        const loader = new GLTFLoader();
        const paths = [
            '/assets/models/asteroids/asteroid1.glb',
            '/assets/models/asteroids/asteroid2.glb',
            '/assets/models/asteroids/asteroid3.glb',
            '/assets/models/asteroids/asteroid4.glb',
            '/assets/models/asteroids/asteroid5.glb'
        ];

        paths.forEach(path => {
            loader.load(path, (gltf) => {
                this.asteroidModels.push(gltf.scene);
            }, undefined, (error) => {
                console.error('Error loading asteroid model:', path, error);
            });
        });
    }

    createMeteorite() {
        if (this.asteroidModels.length === 0) return;
    
        const modelIndex = Math.floor(Math.random() * this.asteroidModels.length);
        const meteor = this.asteroidModels[modelIndex].clone();
    
        // Escala inicial y objetivo
        const minScale = 0.1;
        const maxScale = Math.random() * 0.5 + 0.2;
        meteor.scale.set(minScale, minScale, minScale);
        meteor.userData.targetScale = maxScale;
    
        // Posición aleatoria
        meteor.position.set(
            (Math.random() - 0.5) * 20,
            (Math.random() - 0.5) * 10,
            -50
        );
    
        // Rotación aleatoria
        const axis = new THREE.Vector3(Math.random(), Math.random(), Math.random()).normalize();
        const speed = Math.random() * 1 + 0.5; // rad/s
        meteor.userData.rotationAxis = axis;
        meteor.userData.rotationSpeed = speed;
    
        this.scene.add(meteor);
        this.meteorites.push(meteor);
    }
    
    createTargetCircle() {
        const outerGeometry = new THREE.RingGeometry(1.0, 1.1, 50);
        const outerMaterial = new THREE.MeshBasicMaterial({
            color: 0x000000,
            side: THREE.DoubleSide,
            transparent: false
        });
        const outerRing = new THREE.Mesh(outerGeometry, outerMaterial);
        
        const innerGeometry = new THREE.CircleGeometry(1.0, 32);
        const innerMaterial = new THREE.MeshBasicMaterial({
            color: 0xffffff,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 1
        });
        const innerCircle = new THREE.Mesh(innerGeometry, innerMaterial);
        
        const circleGroup = new THREE.Group();
        circleGroup.add(outerRing);
        circleGroup.add(innerCircle);
        circleGroup.position.set(0, 0, -30);
        circleGroup.userData = { isTarget: true };
        return circleGroup;
    }
    updateMeteorites(delta) {
        if (Math.random() < 0.02) this.createMeteorite();
    
        for (let i = 0; i < this.meteorites.length; i++) {
            const m = this.meteorites[i];
    
            // Movimiento hacia la cámara
            m.position.z += 20 * delta;
    
            // Rotación sobre su propio eje
            if (m.userData.rotationAxis && m.userData.rotationSpeed) {
                m.rotateOnAxis(m.userData.rotationAxis, m.userData.rotationSpeed * delta);
            }
    
            // Escala progresiva
            if (m.userData.targetScale) {
                const scaleDiff = m.userData.targetScale - m.scale.x;
                m.scale.addScalar(scaleDiff * delta); // suaviza el crecimiento
            }
    
            if (m.position.z > 10) {
                this.scene.remove(m);
                this.meteorites.splice(i, 1);
                i--;
            }
        }
    }
    
    checkCollisions() {
        if (!this.ship) return;

        const shipBox = new THREE.Box3().setFromObject(this.ship);

        // Only check meteor collisions if target is not activated
        if (!this.targetActivated) {
            for (let meteor of this.meteorites) {
                const meteorBox = new THREE.Box3().setFromObject(meteor);
                if (shipBox.intersectsBox(meteorBox)) {
                    this.elapsedTime = 0;
                    this.showCollisionFlash();
                    break;
                }
            }
        }

        // Always check target circle collision if it's visible
        if (this.targetCircle.visible) {
            const targetBox = new THREE.Box3().setFromObject(this.targetCircle);
            if (shipBox.intersectsBox(targetBox)) {
                this.triggerWhiteOverlay();
                this.targetCircle.visible = false;
            }
        }
    }

    triggerWhiteOverlay() {
        // Evitar múltiples overlays
        if (this.whiteOverlay) return;
    
        // Crear overlay blanco
        const overlay = document.createElement('div');
        overlay.style.position = 'fixed';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.width = '100%';
        overlay.style.height = '100%';
        overlay.style.backgroundColor = 'white';
        overlay.style.opacity = '0';           // empieza transparente
        overlay.style.transition = 'opacity 1.2s ease-in-out'; // fade-in suave
        overlay.style.zIndex = '1000';
        overlay.style.pointerEvents = 'auto';
        document.body.appendChild(overlay);
        this.whiteOverlay = overlay;
    
        // Activar transición
        requestAnimationFrame(() => {
            overlay.style.opacity = '1'; // llega a blanco total en 1.2s
        });
    
        // Crear círculo negro palpitante en el centro
        const blackCircle = document.createElement('div');
        blackCircle.style.position = 'absolute';
        blackCircle.style.top = '50%';
        blackCircle.style.left = '50%';
        blackCircle.style.transform = 'translate(-50%, -50%)';
        blackCircle.style.width = '50px';
        blackCircle.style.height = '50px';
        blackCircle.style.borderRadius = '50%';
        blackCircle.style.backgroundColor = 'black';
        blackCircle.style.cursor = 'pointer';
        blackCircle.style.animation = 'pulse 1.9s infinite alternate';
        overlay.appendChild(blackCircle);
    
        // Click hacia enlace externo
        blackCircle.addEventListener('click', () => {
            window.open('https://www.ejemplo.com', '_blank');
        });
    
        // Keyframes para el pulso del círculo
        const style = document.createElement('style');
        style.innerHTML = `
            @keyframes pulse {
                0% { transform: translate(-50%, -50%) scale(1); }
                50% { transform: translate(-50%, -50%) scale(1.3); }
                100% { transform: translate(-50%, -50%) scale(1); }
            }
        `;
        document.head.appendChild(style);
    }
    

    showCollisionFlash() {
        this.collisionFlash.style.opacity = '0.6';
        setTimeout(() => {
            this.collisionFlash.style.opacity = '0';
        }, 200);
    }

    updateTargetCircle(delta) {
        if (this.elapsedTime >= this.simulationTime && !this.targetActivated) {
            this.targetCircle.visible = true;
            this.targetActivated = true;
        }
        
        if (this.targetActivated) {
            // Stop the timer by not updating this.elapsedTime
            this.targetCircle.scale.addScalar(delta * 0.5); // Slower growth
            
            if (this.ship) {
                const dir = new THREE.Vector3()
                    .subVectors(this.targetCircle.position, this.ship.position)
                    .normalize()
                    .multiplyScalar(delta * 5);
                this.ship.position.add(dir);
            }
        }
    }

    handleShipMovement(delta) {
        if (!this.ship) return;
        const speed = 10 * delta;
        if (this.keys.w) this.ship.position.z -= speed;
        if (this.keys.s) this.ship.position.z += speed;
        if (this.keys.a) this.ship.position.x -= speed;
        if (this.keys.d) this.ship.position.x += speed;
    }

    onKeyDown(event) {
        const key = event.key.toLowerCase();
        if (this.keys.hasOwnProperty(key)) this.keys[key] = true;
    }

    onKeyUp(event) {
        const key = event.key.toLowerCase();
        if (this.keys.hasOwnProperty(key)) this.keys[key] = false;
    }

    animate() {
        requestAnimationFrame(() => this.animate());

        const now = performance.now();
        const delta = (now - this.lastTime) / 1000;
        this.lastTime = now;

        // Only update timer if target is not activated
        if (!this.targetActivated) {
            this.elapsedTime += delta;
        }

        this.handleShipMovement(delta);
        this.updateMeteorites(delta);
        this.checkCollisions();
        this.updateTargetCircle(delta);

        this.renderer.render(this.scene, this.camera);
    }

    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);

        if (this.ship) {
            this.ship.position.y = -window.innerHeight * 0.3 / 100;
        }
    }
}
