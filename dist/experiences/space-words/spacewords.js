import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export function initSpaceWords(container) {
    // ============================
    // Setup básico
    // ============================
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ 
        antialias: true,
        alpha: false,
        powerPreference: 'high-performance'
    });
    
    // Asegurar que el renderer ocupe todo el espacio sin márgenes
    renderer.setSize(window.innerWidth, window.innerHeight, false);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.domElement.style.display = 'block';
    renderer.domElement.style.margin = '0';
    renderer.domElement.style.padding = '0';
    renderer.domElement.style.position = 'fixed';
    renderer.domElement.style.top = '0';
    renderer.domElement.style.left = '0';
    renderer.domElement.style.outline = 'none';
    
    container.style.margin = '0';
    container.style.padding = '0';
    container.style.overflow = 'hidden';
    container.appendChild(renderer.domElement);
    
    // Cámara siempre en el centro
    camera.position.set(0, 0, 0);
    
    // ============================
    // Sistema de iluminación
    // ============================
    
    // Luz ambiental suave para iluminar todo uniformemente
    const ambientLight = new THREE.AmbientLight(0x404040, 0.8);
    scene.add(ambientLight);
    
    // Luz hemisférica para simular iluminación del espacio
    const hemisphereLight = new THREE.HemisphereLight(0x4040ff, 0x404040, 0.6);
    scene.add(hemisphereLight);
    
    // Luz direccional principal
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.7);
    directionalLight.position.set(10, 10, 5);
    scene.add(directionalLight);
    
    // Luces puntuales de colores para dar ambiente espacial
    const pointLight1 = new THREE.PointLight(0x4444ff, 0.5, 100);
    pointLight1.position.set(20, 20, 20);
    scene.add(pointLight1);
    
    const pointLight2 = new THREE.PointLight(0xff4444, 0.3, 80);
    pointLight2.position.set(-15, -10, 25);
    scene.add(pointLight2);
    
    const pointLight3 = new THREE.PointLight(0x44ff44, 0.4, 90);
    pointLight3.position.set(0, -20, -30);
    scene.add(pointLight3);
    
    // ============================
    // Variables de control de cámara
    // ============================
    let isMouseDown = false;
    let mouseX = 0, mouseY = 0;
    let targetRotationX = 0, targetRotationY = 0;
    let currentRotationX = 0, currentRotationY = 0;
    
    // ============================
    // Frases y sus posiciones esféricas
    // ============================
    const phrases = [
        {
            text: "NOXISTENCE, before nonexistence, is a constant reverie.",
            position: new THREE.Vector3(50, 20, 30), // Posición en la esfera
            element: null,
            active: false
        },
        {
            text: "Here there are no laws, only temporary conditions for the impossible to manifest.",
            position: new THREE.Vector3(-40, 35, 25),
            element: null,
            active: false
        },
        {
            text: "Is there something like consciousness? Does it truly observe?",
            position: new THREE.Vector3(30, -45, -20),
            element: null,
            active: false
        },
        {
            text: "No one is a prophet in their own land, and I was not one (nor ever will be) even in my own time.",
            position: new THREE.Vector3(-35, -25, 40),
            element: null,
            active: false
        },
        {
            text: "I could never be more than poetry clinging to nonexistence.",
            position: new THREE.Vector3(15, 40, -35),
            element: null,
            active: false
        }
    ];
    
    // Crear elementos HTML para las frases
    phrases.forEach((phrase, index) => {
        const element = document.createElement('div');
        element.className = 'space-text';
        element.innerHTML = phrase.text;
        element.style.display = 'none';
        container.appendChild(element);
        phrase.element = element;
    });
    
    // ============================
    // Carga del skybox
    // ============================
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
            skybox.scale.set(100, 100, 100);
            scene.add(skybox);
            
        },
        (error) => {
            // Crear un skybox de respaldo
            createFallbackSkybox();
        }
    );
    
    // ============================
    // Skybox de respaldo
    // ============================
    function createFallbackSkybox() {
        // Crear una escena separada para el fondo fijo
        const bgScene = new THREE.Scene();
        const bgCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
        
        // Crear textura estrellada
        const canvas = document.createElement('canvas');
        canvas.width = 2048;  // Mayor resolución para mejor calidad
        canvas.height = 1024;
        const context = canvas.getContext('2d');
        
        // Fondo espacial oscuro
        const gradient = context.createLinearGradient(0, 0, 0, canvas.height);
        gradient.addColorStop(0, '#000428');
        gradient.addColorStop(1, '#004e92');
        context.fillStyle = gradient;
        context.fillRect(0, 0, canvas.width, canvas.height);
        
        // Función para añadir nebulosas
        function addNebula(x, y, radius, color, alpha) {
            const gradient = context.createRadialGradient(x, y, 0, x, y, radius);
            gradient.addColorStop(0, `${color}${Math.floor(alpha * 255).toString(16).padStart(2, '0')}`);
            gradient.addColorStop(1, `${color}00`);
            
            context.fillStyle = gradient;
            context.globalCompositeOperation = 'lighter';
            context.beginPath();
            context.arc(x, y, radius, 0, Math.PI * 2);
            context.fill();
            context.globalCompositeOperation = 'source-over';
        }
        
        // Añadir nebulosas
        const nebulaColors = ['#3a1c71', '#d76d77', '#ffaf7b', '#11998e', '#38ef7d', '#a8e063'];
        for (let i = 0; i < 20; i++) {
            const x = Math.random() * canvas.width;
            const y = Math.random() * canvas.height;
            const radius = 100 + Math.random() * 300;
            const color = nebulaColors[Math.floor(Math.random() * nebulaColors.length)];
            addNebula(x, y, radius, color, 0.1 + Math.random() * 0.2);
        }
        
        // Añadir estrellas
        function addStar(x, y, size, brightness) {
            context.fillStyle = `rgba(255, 255, 255, ${brightness})`;
            
            if (Math.random() < 0.1) {
                // Estrella con destello
                context.beginPath();
                context.arc(x, y, size * 1.5, 0, Math.PI * 2);
                context.fill();
                
                // Destello en cruz
                context.strokeStyle = `rgba(255, 255, 255, ${brightness * 0.7})`;
                context.lineWidth = 0.8;
                context.beginPath();
                context.moveTo(x - size * 4, y);
                context.lineTo(x + size * 4, y);
                context.moveTo(x, y - size * 4);
                context.lineTo(x, y + size * 4);
                context.stroke();
            } else {
                // Estrella normal
                context.fillRect(x - size/2, y - size/2, size, size);
            }
        }
        
        // Generar estrellas
        const starCount = 5000;
        for (let i = 0; i < starCount; i++) {
            const x = Math.random() * canvas.width;
            const y = Math.random() * canvas.height;
            const size = Math.random() * 1.5 + 0.5;
            const brightness = Math.random() * 0.8 + 0.2; // 0.2 a 1.0
            
            addStar(x, y, size, brightness);
            
            // Añadir algunas estrellas más pequeñas alrededor para mayor densidad
            if (Math.random() > 0.7) {
                const offset = () => (Math.random() - 0.5) * 10;
                addStar(x + offset(), y + offset(), size * 0.5, brightness * 0.7);
            }
        }
        
        // Crear textura desde el canvas
        const texture = new THREE.CanvasTexture(canvas);
        texture.minFilter = THREE.LinearFilter;
        texture.magFilter = THREE.LinearFilter;
        texture.format = THREE.RGBAFormat;
        
        // Crear plano de fondo fijo
        const bgGeometry = new THREE.PlaneGeometry(2, 2);
        const bgMaterial = new THREE.MeshBasicMaterial({
            map: texture,
            depthTest: false,
            depthWrite: false,
            transparent: true
        });
        
        const bgPlane = new THREE.Mesh(bgGeometry, bgMaterial);
        bgScene.add(bgPlane);
        
        // Función para renderizar el fondo
        function renderBackground() {
            renderer.autoClear = false;
            renderer.clear();
            
            // Renderizar el fondo primero
            renderer.render(bgScene, bgCamera);
            
            // Luego renderizar la escena normal
            renderer.render(scene, camera);
        }
        
        // Reemplazar la función de renderizado original
        const originalAnimate = animate;
        animate = function() {
            originalAnimate();
            renderBackground();
        };
        
    }
    
    // ============================
    // Controles de mouse
    // ============================
    function onMouseDown(event) {
        isMouseDown = true;
        mouseX = event.clientX;
        mouseY = event.clientY;
        renderer.domElement.style.cursor = 'grabbing';
    }
    
    function onMouseMove(event) {
        if (!isMouseDown) return;
        
        const deltaX = event.clientX - mouseX;
        const deltaY = event.clientY - mouseY;
        
        targetRotationY -= deltaX * 0.005;
        targetRotationX -= deltaY * 0.005;
        
        // Limitar pitch para evitar gimbal lock
        targetRotationX = Math.max(-Math.PI / 2 + 0.1, Math.min(Math.PI / 2 - 0.1, targetRotationX));
        
        mouseX = event.clientX;
        mouseY = event.clientY;
    }
    
    function onMouseUp() {
        isMouseDown = false;
        renderer.domElement.style.cursor = 'grab';
    }
    
    function onWheel(event) {
        event.preventDefault();
        
        const zoomSpeed = 0.1;
        const minFov = 10;
        const maxFov = 120;
        
        camera.fov += event.deltaY * zoomSpeed;
        camera.fov = Math.max(minFov, Math.min(maxFov, camera.fov));
        camera.updateProjectionMatrix();
    }
    
    function onClick(event) {
        checkPhraseClick(event);
    }
    
    // ============================
    // Detección de clicks en frases
    // ============================
    function checkPhraseClick(event) {
        const raycaster = new THREE.Raycaster();
        const mouse = new THREE.Vector2();
        
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        
        raycaster.setFromCamera(mouse, camera);
        const direction = raycaster.ray.direction;
        
        // Verificar si estamos mirando hacia alguna frase
        phrases.forEach((phrase) => {
            if (phrase.active) return;
            
            const phraseDirection = phrase.position.clone().normalize();
            const angle = direction.angleTo(phraseDirection);
            
            // Si el ángulo es menor a ~30 grados (0.5 radianes)
            if (angle < 0.5) {
                activatePhrase(phrase);
            }
        });
    }
    
    // ============================
    // Activación de frases
    // ============================
    function activatePhrase(phrase) {
        phrase.active = true;
        phrase.element.style.display = 'block';
        phrase.element.classList.add('space-text-appear');
        
        // Auto-desvanecimiento después de 4 segundos
        setTimeout(() => {
            phrase.element.classList.remove('space-text-appear');
            phrase.element.classList.add('space-text-disappear');
            
            setTimeout(() => {
                phrase.element.style.display = 'none';
                phrase.element.classList.remove('space-text-disappear');
                phrase.active = false;
            }, 1500); // Tiempo de animación de desaparición
        }, 6000); // Tiempo que el texto permanece visible
    }
    
    // ============================
    // Conversión 3D a 2D y posicionamiento
    // ============================
    function updateTextPositions() {
        phrases.forEach((phrase) => {
            if (!phrase.active) return;
            
            const vector = phrase.position.clone();
            vector.project(camera);
            
            const x = (vector.x * 0.5 + 0.5) * window.innerWidth;
            const y = (vector.y * -0.5 + 0.5) * window.innerHeight;
            
            // Solo mostrar si está en frente de la cámara
            if (vector.z < 1) {
                phrase.element.style.left = x + 'px';
                phrase.element.style.top = y + 'px';
                phrase.element.style.opacity = '1';
            } else {
                phrase.element.style.opacity = '0';
            }
        });
    }
    
    // ============================
    // Eventos
    // ============================
    renderer.domElement.addEventListener('mousedown', onMouseDown);
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
    renderer.domElement.addEventListener('wheel', onWheel, { passive: false });
    renderer.domElement.addEventListener('click', onClick);
    renderer.domElement.style.cursor = 'grab';
    
    // ============================
    // Resize
    // ============================
    function onResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }
    
    window.addEventListener('resize', onResize);
    
    // ============================
    // Loop de animación
    // ============================
    function animate() {
        requestAnimationFrame(animate);
        
        // Suavizar rotación de cámara
        currentRotationX += (targetRotationX - currentRotationX) * 0.1;
        currentRotationY += (targetRotationY - currentRotationY) * 0.1;
        
        // Aplicar rotación a la cámara
        camera.rotation.order = 'YXZ';
        camera.rotation.x = currentRotationX;
        camera.rotation.y = currentRotationY;
        
        // Animación sutil de las luces puntuales para crear ambiente dinámico
        const time = Date.now() * 0.001;
        if (scene.children.length > 3) { // Verificar que las luces existan
            const lights = scene.children.filter(child => child instanceof THREE.PointLight);
            if (lights.length >= 3) {
                lights[0].intensity = 0.5 + Math.sin(time * 0.7) * 0.2;
                lights[1].intensity = 0.3 + Math.cos(time * 0.5) * 0.1;
                lights[2].intensity = 0.4 + Math.sin(time * 0.3) * 0.15;
            }
        }
        
        // Actualizar posiciones de texto
        updateTextPositions();
        
        renderer.render(scene, camera);
    }
    
    animate();
    
    // ============================
    // Cleanup function
    // ============================
    return {
        destroy: () => {
            renderer.domElement.removeEventListener('mousedown', onMouseDown);
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
            renderer.domElement.removeEventListener('wheel', onWheel);
            renderer.domElement.removeEventListener('click', onClick);
            window.removeEventListener('resize', onResize);
            
            // Limpiar elementos HTML
            phrases.forEach(phrase => {
                if (phrase.element && phrase.element.parentNode) {
                    phrase.element.parentNode.removeChild(phrase.element);
                }
            });
            
            renderer.dispose();
        }
    };
}