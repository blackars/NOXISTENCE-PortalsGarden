// wordsrain.js — componente (módulo ES) actualizado para dispersión completa
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls.js';
import * as tf from '@tensorflow/tfjs';

// Context phrases and responses (poetic-philosophical monologue)
const CONTEXT_PHRASES = [
    "Consciousness emerges as a radiance within the complexity of the void",
    "Thought unfolds into an infinite web of unseen connections",
    "Intelligences are mirrors where the human mind splits and fragments",
    "Perception erects the foundations of the real amid nothingness",
    "Language is a secret river that sculpts the shape of thought",
    "The mind is a universe suspended within itself, boundless and wandering",
    "Cognition transcends the brain and spills across space-time",
    "Consciousness flows as a perpetually emergent process",
    "Learning is metamorphosis, an evolution inscribed in silence",
    "Creativity blossoms from the impossible union of distant ideas"
  ];
  
  const RESPONSES = [
    "Perspective dissolves into the depths of the mind",
    "Every reflection is a mirror where the human contemplates itself",
    "Consciousness remains the primordial mystery",
    "Machines dream upon the threshold of the impossible",
    "The mind shines within its own complexity",
    "Thought folds into the texture of its processes",
    "The boundary between the human and the artificial is a river in shadow",
    "Understanding dissolves into an endless echo",
    "Consciousness breathes as the greatest enigma of the universe",
    "Each thought is a spark flickering within the vast neural expanse"
  ];
  

export default function initWordsRain(opts = {}) {
  // Elementos de la interfaz de usuario
  const speechBubble = document.getElementById('speechBubble');
  const speechText = document.getElementById('speechText');
  


  // Mostrar un mensaje en la burbuja de diálogo
  const showMessage = async (message) => {
    speechBubble.classList.add('visible');
    speechText.textContent = '';
    
    // Efecto de escritura
    for (let i = 0; i < message.length; i++) {
      speechText.textContent += message[i];
      await new Promise(resolve => setTimeout(resolve, 20));
    }
    
    // Ocultar después de un tiempo
    setTimeout(() => {
      speechBubble.classList.remove('visible');
    }, 5000);
  };

  // Generar una respuesta usando frases predefinidas
  const generateResponse = async () => {
    try {
      // Simular tiempo de procesamiento
      await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
      
      // Seleccionar una respuesta aleatoria
      const randomResponse = RESPONSES[Math.floor(Math.random() * RESPONSES.length)];
      return randomResponse;
    } catch (error) {
      console.error('Error generating response:', error);
      // Fallback a respuestas predefinidas
      return CONTEXT_PHRASES[Math.floor(Math.random() * CONTEXT_PHRASES.length)];
    }
  };

  // Manejar el clic en el cerebro
  const handleBrainClick = async () => {
    if (isTalking) return;
    isTalking = true;
    
    try {
      const response = await generateResponse();
      await showMessage(response);
    } catch (error) {
      console.error('Error in brain click handler:', error);
    } finally {
      isTalking = false;
    }
  };

  const container = opts.container || document.body;
  const modelPath = opts.modelPath || '/assets/models/humanbrain.glb';
  const FONT_FAMILIES = ['Nightcore', 'BatesShower', 'StormGust'];
  
  // Estado para controlar si ya se está mostrando un mensaje
  let isTalking = false;

  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(container.clientWidth, container.clientHeight, false);
  renderer.outputEncoding = THREE.sRGBEncoding;
  container.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x000000);

  const camera = new THREE.PerspectiveCamera(60, container.clientWidth / container.clientHeight, 0.1, 2000);
  camera.position.set(0, 40, 40);

  const hemi = new THREE.HemisphereLight(0xffffff, 0xffffff, 9);
  scene.add(hemi);
  const dir = new THREE.DirectionalLight(0xffffff, 9);
  dir.position.set(10, 20, 10);
  scene.add(dir);

  const planeSize = 200;
  const plane = new THREE.Mesh(new THREE.PlaneGeometry(planeSize, planeSize), new THREE.MeshStandardMaterial({ color: 0x000000, metalness: 0, roughness: 1 }));
  plane.rotation.x = -Math.PI / 2;
  scene.add(plane);

  const grid = new THREE.GridHelper(planeSize, planeSize / 6, 0xffffff, 0xffffff);
  scene.add(grid);

  const loader = new GLTFLoader();
  let brainRoot = new THREE.Object3D();
  scene.add(brainRoot);

  function loadModel() {
    loader.load(modelPath, (gltf) => {
      const model = gltf.scene || gltf.scenes[0];
      model.traverse(c => { 
        if (c.isMesh) { 
          c.castShadow = false; 
          c.receiveShadow = false; 
          // Hacer que el modelo sea interactivo
          c.userData.clickable = true;
          // Guardar referencia al modelo para usarla después
          if (!brainModel) brainModel = c;
          c.material = c.material || new THREE.MeshStandardMaterial({color: 0xffffff});
        } 
      });
      model.scale.setScalar(30);
      model.position.set(0, 20, 0);
      brainRoot.add(model);
      brainRoot.userData.bounds = new THREE.Box3().setFromObject(model);
    }, undefined, () => { createFallbackGeometry(); });
  }

  function createFallbackGeometry() {
    const geometry = new THREE.IcosahedronGeometry(5, 1);
    const material = new THREE.MeshStandardMaterial({ color: 0x00ff00, wireframe: true });
    const sphere = new THREE.Mesh(geometry, material);
    sphere.position.set(0, 6, 0);
    brainRoot.add(sphere);
  }

  loadModel();

  const activeSprites = [];
  const WORDS = ["memory","shdadow","NOX","hidden","void","arca","echo","lumen","axis",
    "pulse","sigil","inexistence", "will", "paradox", "ontological", "ephemeral", 
    "fluctuations", "transmedia", "ritual", "limina", "hallucination", "reverie", 
    "vestiges", "codex", "bestiary", "fragments", "shadows", "glitch", "symmetry", 
    "void", "mutations", "maxkodia", "anothearth", "deepspace", "portals", "geometries",
    "grids", "asteroids", "moons", "garden", "planes"];

  let emissionRate = 25, emitAccumulator = 0;

  function createTextSprite(word){
    // Crear un canvas temporal para medir el ancho del texto
    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d');
    const baseFontSize = 60 + Math.random() * 60;
    
    // Seleccionar una fuente aleatoria del array
    const randomFontIndex = Math.floor(Math.random() * FONT_FAMILIES.length);
    const selectedFont = FONT_FAMILIES[randomFontIndex];
    tempCtx.font = `${baseFontSize}px ${selectedFont}`;
    
    // Calcular métricas del texto
    const metrics = tempCtx.measureText(word);
    const textWidth = metrics.width;
    const textHeight = baseFontSize * 1.2; // Aproximar altura del texto
    
    // Crear el canvas real con tamaño dinámico basado en el texto
    const padding = 30; // Agregar algo de relleno alrededor del texto
    const canvas = document.createElement('canvas');
    canvas.width = Math.max(256, Math.min(1024, textWidth + padding * 2)); // Mín 256px, Máx 1024px de ancho
    canvas.height = Math.max(256, textHeight + padding * 2); // Mantener relación de aspecto cuadrada
    canvas.style.backgroundColor = 'transparent';
    
    // Configurar el contexto
    const ctx = canvas.getContext('2d');
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    
    // Calcular el tamaño de fuente para ajustarse al canvas si es necesario
    let fontSize = baseFontSize;
    if (textWidth > canvas.width - padding * 2) {
      fontSize = Math.floor((baseFontSize * (canvas.width - padding * 2)) / textWidth * 0.9);
    }
    
    // Establecer la fuente final y dibujar el texto
    ctx.font = `${fontSize}px ${selectedFont}`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#fff';
    ctx.lineWidth = Math.max(2, Math.floor(fontSize * 0.06));
    ctx.strokeStyle = '#fff';
    
    // Dibujar el texto
    ctx.strokeText(word, centerX, centerY);
    ctx.fillText(word, centerX, centerY);
    const tex=new THREE.CanvasTexture(canvas);
    tex.encoding=THREE.sRGBEncoding;
    const sp=new THREE.Sprite(new THREE.SpriteMaterial({map:tex,transparent:true,depthWrite:false}));
    const scale=1.5+(fontSize/100)*(0.8+Math.random()*1.2);
    sp.scale.set(scale*5,scale*5);
    sp.userData={ life:8+Math.random()*4, age:0, vel:new THREE.Vector3(), fadeStart:2+Math.random() }; // vel se asignará abajo
    return sp;
  }

  function emitFromBrain(delta){
    emitAccumulator += emissionRate*delta;
    while(emitAccumulator>=1){
      emitAccumulator -= 1;
      const word = WORDS[Math.floor(Math.random()*WORDS.length)];
      const sp = createTextSprite(word);
      // posición inicial: el centro del brain o fallback
      const pos = new THREE.Vector3(0,8,0);
      if(brainRoot.userData.bounds) brainRoot.userData.bounds.getCenter(pos);
      pos.y += 1.5;
      sp.position.copy(pos);
      // dispersión completamente aleatoria dentro del grid
      const range = 200; // mitad del planeSize
      sp.userData.vel.set((Math.random()-0.5)*2.5,0.5+Math.random()*1.5,(Math.random()-0.5)*2.5);
      sp.position.x += (Math.random()-0.5)*range;
      sp.position.z += (Math.random()-0.5)*range;
      sp.position.y += Math.random()*20-5; // dispersión vertical
      sp.userData.spin = (Math.random()-0.5)*0.1;
      scene.add(sp); activeSprites.push(sp);
    }
  }

  function updateSprites(delta){
    for(let i=activeSprites.length-1;i>=0;i--){
      const s = activeSprites[i];
      s.userData.age += delta;
      s.position.addScaledVector(s.userData.vel, delta);
      if(s.userData.age>s.userData.fadeStart){
        const t=(s.userData.age-s.userData.fadeStart)/(s.userData.life-s.userData.fadeStart);
        s.material.opacity=Math.max(0,1-t);
      }
      if(s.userData.age>=s.userData.life){
        scene.remove(s); activeSprites.splice(i,1);
        if(s.material.map) s.material.map.dispose(); if(s.material) s.material.dispose();
      }
    }
  }

  // Variables para el raycasting
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();
  let clickCount = 0;
  const requiredClicks = 3;
  let brainModel = null;
  let isSummoning = false;

  // Controles
  const keys = {}; 
  const controls = new PointerLockControls(camera, renderer.domElement);
  camera.position.set(0, 10, 100);
  scene.add(camera);
  
  // Manejar clics del ratón
  function onMouseClick(event) {
    if (!controls.isLocked) {
      togglePointerLock();
      return;
    }

    if (isSummoning || isTalking) return;

    // Configurar el rayo desde la cámara
    const mouse = new THREE.Vector2();
    const rect = renderer.domElement.getBoundingClientRect();
    mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(scene.children, true);

    // Verificar si el clic fue en el modelo del cerebro
    const brainIntersect = intersects.find(item => 
      item.object.userData.clickable === true
    );

    if (brainIntersect) {
      clickCount++;
      console.log(`Brain clicked! Count: ${clickCount}`);
      
      // Efecto visual de clic
      const brainModel = brainIntersect.object;
      const originalScale = brainModel.scale.clone();
      brainModel.scale.multiplyScalar(0.9);
      
      setTimeout(() => {
        brainModel.scale.copy(originalScale);
      }, 100);

      // Manejar el clic en el cerebro
      handleBrainClick();
    }
  }
  
  // Función para iniciar la animación de invocación
  function startSummonAnimation() {
    if (isSummoning) return;
    isSummoning = true;
    console.log('Starting summon animation...');
    
    // Aquí irá la lógica de la animación de invocación
    // Por ahora, solo un efecto de escalado
    if (brainModel) {
      const startScale = brainModel.scale.clone();
      const targetScale = startScale.clone().multiplyScalar(1.5);
      
      const duration = 10000; // 10 segundos
      const startTime = Date.now();
      
      function animateSummon() {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Interpolación suave
        const t = Math.sin(progress * Math.PI * 0.5);
        brainModel.scale.lerpVectors(startScale, targetScale, t);
        
        // Continuar la animación hasta que se complete
        if (progress < 1) {
          requestAnimationFrame(animateSummon);
        } else {
          // Llamar a la lógica después de la animación
          onSummonComplete();
        }
      }
      
      animateSummon();
    }
  }
  
  // Function called when the summon animation completes (kept for compatibility)
  function onSummonComplete() {
    console.log('Summon complete!');
  }
  
  // Create a circle geometry for the expansion effect
  const circleGeometry = new THREE.CircleGeometry(0.1, 64);
  const circleMaterial = new THREE.MeshBasicMaterial({ 
    color: 0x000000,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 1
  });
  const circle = new THREE.Mesh(circleGeometry, circleMaterial);
  circle.rotation.x = -Math.PI / 2; // Make it horizontal
  circle.position.y = 0.1; // Slightly above the ground to avoid z-fighting
  scene.add(circle);
  circle.visible = false;

  // Function to animate the circle expansion
  function animateCircleExpansion() {
    const maxRadius = 1500; // max radius in pixels
    const duration = 30000; // duration in ms 
    const startTime = Date.now();
    
    circle.visible = true;
    circle.scale.set(0.1, 0.1, 1);
    
    function updateCircle() {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Ease out function for smooth deceleration
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      const currentRadius = 1 + (maxRadius * easedProgress);
      
      // Update circle scale
      circle.scale.set(currentRadius, currentRadius, 1);
      
      if (progress < 1) {
        requestAnimationFrame(updateCircle);
      } else {
        setTimeout(() => {
          circle.visible = false;
          // Reset summon state after the effect is complete
          clickCount = 0;
          isSummoning = false;
        }, 1000);
      }
    }
    
    updateCircle();
  }

  // Agregar el manejador de eventos de clic
  window.addEventListener('click', onMouseClick, false);
  
  // Handle pointer lock with proper error handling
  function togglePointerLock() {
    if (controls.isLocked) {
      controls.unlock();
    } else {
      const promise = controls.lock();
      if (promise && promise.catch) {
        promise.catch(err => console.error('Error locking pointer:', err));
      }
    }
  }

  document.addEventListener('keydown', e => {
    keys[e.code] = true;
    if (e.code === 'KeyP') togglePointerLock();
  });
  
  document.addEventListener('keyup', e => {
    keys[e.code] = false;
  });
  
  window.addEventListener('resize', () => {
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight, false);
  });
  
  container.addEventListener('click', () => {
    if (!controls.isLocked) togglePointerLock();
  });

  // Definir los límites del grid
  const gridSize = planeSize / 2;
  const minY = 1.6; // Altura mínima de la cámara
  const maxY = 50;   // Altura máxima de la cámara

  const clock = new THREE.Clock();
  function animate(){
    const delta = Math.min(0.1, clock.getDelta());
    if(controls.isLocked) {
      const moveSpeed = 15 * delta;
      const moveX = (keys['KeyD'] || keys['ArrowRight'] ? 1 : 0) - (keys['KeyA'] || keys['ArrowLeft'] ? 1 : 0);
      const moveZ = (keys['KeyW'] || keys['ArrowUp'] ? 1 : 0) - (keys['KeyS'] || keys['ArrowDown'] ? 1 : 0);
      
      // Mover hacia adelante/atrás
      if (moveZ !== 0) {
        controls.moveForward(moveZ * moveSpeed);
      }
      // Mover izquierda/derecha
      if (moveX !== 0) {
        controls.moveRight(moveX * moveSpeed);
      }
      
      // Aplicar límites del grid
      camera.position.x = THREE.MathUtils.clamp(camera.position.x, -gridSize, gridSize);
      camera.position.z = THREE.MathUtils.clamp(camera.position.z, -gridSize, gridSize);
      camera.position.y = THREE.MathUtils.clamp(camera.position.y, minY, maxY);
    }
    emitFromBrain(delta); 
    updateSprites(delta);
    renderer.render(scene,camera); 
    requestAnimationFrame(animate);
  }
  animate();

  // Limpiar recursos al desmontar
  function dispose() {
    window.removeEventListener('click', onMouseClick, false);
    // Limpiar otros recursos si es necesario
  }

  return { 
    scene, 
    camera, 
    renderer, 
    setEmissionRate(v) { emissionRate = v; },
    dispose
  };
}
