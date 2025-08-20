// wordsrain.js — componente (módulo ES) actualizado para dispersión completa
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls.js';

export default function initWordsRain(opts = {}) {
  const container = opts.container || document.body;
  const modelPath = opts.modelPath || '/assets/models/brain.glb';
  const FONT_FAMILIES = ['Gobold', 'Arial', 'sans-serif'];

  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(container.clientWidth, container.clientHeight, false);
  renderer.outputEncoding = THREE.sRGBEncoding;
  container.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0xffffff);

  const camera = new THREE.PerspectiveCamera(60, container.clientWidth / container.clientHeight, 0.1, 2000);
  camera.position.set(0, 40, 40);

  const hemi = new THREE.HemisphereLight(0xffffff, 0xffffff, 9);
  scene.add(hemi);
  const dir = new THREE.DirectionalLight(0xffffff, 9);
  dir.position.set(10, 20, 10);
  scene.add(dir);

  const planeSize = 200;
  const plane = new THREE.Mesh(new THREE.PlaneGeometry(planeSize, planeSize), new THREE.MeshStandardMaterial({ color: 0xffffff, metalness: 0, roughness: 1 }));
  plane.rotation.x = -Math.PI / 2;
  scene.add(plane);

  const grid = new THREE.GridHelper(planeSize, planeSize / 6, 0x000000, 0x000000);
  scene.add(grid);

  const loader = new GLTFLoader();
  let brainRoot = new THREE.Object3D();
  scene.add(brainRoot);

  function loadModel() {
    loader.load(modelPath, (gltf) => {
      const model = gltf.scene || gltf.scenes[0];
      model.traverse(c => { if(c.isMesh){ c.castShadow=false; c.receiveShadow=false; c.material=c.material||new THREE.MeshStandardMaterial({color:0xffffff}); } });
      model.scale.setScalar(30);
      model.position.set(0,20,0);
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
  const WORDS = ["memoria","sombra","no-x","oculto","void","arca","nox","ánima","vínculo",
    "echo","lumen","axis","pulse","sigil","códice","árbol","fénix","límite","⟟⟠⟡","⨀⨂⨁",
    "✶✷✸","𐍈𐍉𐍊","شعاع","נופל","жизнь","外来","⊗⊕⊘"];

  let emissionRate = 25, emitAccumulator = 0;

  function createTextSprite(word){
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = 512;
    canvas.style.backgroundColor = 'transparent';
    
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0,0,812,812);
    const fontSize = Math.floor(60+Math.random()*60);
    ctx.font = `${fontSize}px ${FONT_FAMILIES.join(', ')}`;
    ctx.textAlign='center'; ctx.textBaseline='middle';
    ctx.fillStyle='#000'; ctx.lineWidth=Math.max(2, Math.floor(fontSize*0.06)); ctx.strokeStyle='#000';
    ctx.strokeText(word,256,256); ctx.fillText(word,256,256);
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

  const keys = {}; 
  const controls = new PointerLockControls(camera, renderer.domElement);
  // Usar el objeto de cámara directamente para los controles
  camera.position.set(0, 10, 100);
  scene.add(camera);
  
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

  return { scene, camera, renderer, setEmissionRate(v){emissionRate=v;} };
}
