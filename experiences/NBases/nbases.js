import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

// ============================
// Setup básico
// ============================
const canvas = document.getElementById('escena');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(canvas.clientWidth, canvas.clientHeight);

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xffffff);

const camera = new THREE.PerspectiveCamera(45, canvas.clientWidth / canvas.clientHeight, 0.1, 200);
camera.position.set(0, 6, 10);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.06;
controls.target.set(0, 0, 0);

// Luces
const dir = new THREE.DirectionalLight(0xffffff, 1);
dir.position.set(5, 10, 7);
scene.add(dir, new THREE.AmbientLight(0xffffff, 0.55));

// ============================
// Plano base (borde + líneas)
// ============================
const SIZE = 8;
const planeGeom = new THREE.PlaneGeometry(SIZE, SIZE, 1, 1);
// El material del plano es transparente; el borde y líneas dibujan el "look".
const planeMat = new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0 });
const plane = new THREE.Mesh(planeGeom, planeMat);
plane.rotation.x = -Math.PI / 2;
scene.add(plane);

// Borde
const planeEdges = new THREE.EdgesGeometry(planeGeom);
const planeBorder = new THREE.LineSegments(planeEdges, new THREE.LineBasicMaterial({ linewidth: 2, color: 0x000000 }));
plane.add(planeBorder);

// Líneas divisorias (cruz)
const lineMat = new THREE.LineBasicMaterial({ color: 0x000000 });
const mid = SIZE / 2;
// Horizontal (sobre X)
{
  const pts = [new THREE.Vector3(-mid, 0.01, 0), new THREE.Vector3(mid, 0.01, 0)];
  const geo = new THREE.BufferGeometry().setFromPoints(pts);
  const line = new THREE.Line(geo, lineMat);
  scene.add(line);
}
// Vertical (sobre Z)
{
  const pts = [new THREE.Vector3(0, 0.01, -mid), new THREE.Vector3(0, 0.01, mid)];
  const geo = new THREE.BufferGeometry().setFromPoints(pts);
  const line = new THREE.Line(geo, lineMat);
  scene.add(line);
}

// ============================
// Zonas / Droppoints
// ============================
const HALF = SIZE / 4; // distancia al centro de cada cuadrante
const dropZones = [
  new THREE.Vector3(-HALF, 0.01, -HALF), // Zona 1 (arriba-izq)
  new THREE.Vector3( HALF, 0.01, -HALF), // Zona 2 (arriba-der)
  new THREE.Vector3(-HALF, 0.01,  HALF), // Zona 3 (abajo-izq)
  new THREE.Vector3( HALF, 0.01,  HALF), // Zona 4 (abajo-der)
];

// Triángulos de referencia en cada zona
for (const pos of dropZones) {
  const triShape = new THREE.Shape();
  triShape.moveTo(0, 0.25);
  triShape.lineTo(-0.22, -0.22);
  triShape.lineTo(0.22, -0.22);
  triShape.closePath();
  const tri = new THREE.Mesh(new THREE.ShapeGeometry(triShape), new THREE.MeshBasicMaterial({ color: 0x000000 }));
  tri.rotation.x = -Math.PI / 2;
  tri.position.copy(pos);
  scene.add(tri);
}

// ============================
// Modelos y estado
// ============================
const loader = new GLTFLoader();
// Claves deben coincidir con data-mol en HTML
const MODELS = {
  adenina: '/assets/models/Adenina.glb',
  timina: '/assets/models/Timina.glb', // HTML usa "timina"; archivo: Timina.glb
  citosina: '/assets/models/Citosina.glb',
  guanina: '/assets/models/Guanina.glb',
};
const LABELS = {
  adenina: 'Adenina',
  timina: 'Timina',
  citosina: 'Citosina',
  guanina: 'Guanina',
};

// 4 zonas
const zoneState = [null, null, null, null]; // guarda clave mol por zona (0..3)
const zoneModels = [null, null, null, null]; // referencia a 3D por zona
const mixers = [];
const clock = new THREE.Clock();

// ============================
// UI: Cuadrícula de 2x2 (esquina sup. derecha)
// ============================
const uiPanel = document.createElement('div');
uiPanel.style.position = 'fixed';
uiPanel.style.top = '40px';
uiPanel.style.right = '40px';
uiPanel.style.width = '150px';
uiPanel.style.height = '150px';
uiPanel.style.display = 'grid';
uiPanel.style.gridTemplateColumns = '1fr 1fr';
uiPanel.style.gridTemplateRows = '1fr 1fr';
uiPanel.style.gap = '4px';
uiPanel.style.pointerEvents = 'none';
document.body.appendChild(uiPanel);

// Crear los 4 cuadrantes
const quadrants = [];
for (let i = 0; i < 4; i++) {
  const quad = document.createElement('div');
  quad.style.border = '2px solid #000';
  quad.style.display = 'flex';
  quad.style.alignItems = 'center';
  quad.style.justifyContent = 'center';
  quad.style.fontFamily = 'monospace';
  quad.style.fontSize = '12px';
  quad.style.fontWeight = 'bold';
  quad.style.background = 'rgba(255, 255, 255, 0.7)';
  quad.style.position = 'relative';
  quad.style.overflow = 'hidden';
  
  const label = document.createElement('div');
  label.textContent = '0';
  label.style.textAlign = 'center';
  label.style.width = '100%';
  
  const zoneNum = document.createElement('div');
  zoneNum.textContent = `Z${i+1}`;
  zoneNum.style.position = 'absolute';
  zoneNum.style.top = '2px';
  zoneNum.style.left = '2px';
  zoneNum.style.fontSize = '10px';
  zoneNum.style.opacity = '0.7';
  
  quad.appendChild(label);
  quad.appendChild(zoneNum);
  uiPanel.appendChild(quad);
  quadrants.push({ element: quad, label });
}

function updatePanel(extra = '') {
  zoneState.forEach((zone, i) => {
    const { label } = quadrants[i];
    label.textContent = zone ? LABELS[zone].charAt(0) : '0';
    label.style.color = zone ? '#000' : '#999';
    label.style.fontSize = zone ? '24px' : '18px';
    label.style.fontWeight = zone ? 'bold' : 'normal';
  });
  
  // Verificar si todas las zonas están ocupadas
  if (zoneState.every(Boolean)) {
    // Aquí podrías agregar alguna animación o feedback visual
  }
  
  // Verificar combinaciones
  checkCombinations();
}
updatePanel();

// ============================
// Miniaturas (thumbnails) integradas en lateral
// ============================
const thumbRenderers = [];
const thumbScenes = [];
const thumbCameras = [];
const thumbMixers = [];
const thumbModels = [];

function fitModelToCamera(model, camera) {
  // Centrar y escalar el modelo para que quepa en el thumbnail
  const box = new THREE.Box3().setFromObject(model);
  const size = new THREE.Vector3();
  const center = new THREE.Vector3();
  box.getSize(size);
  box.getCenter(center);
  model.position.sub(center);

  const maxDim = Math.max(size.x, size.y, size.z);
  if (maxDim > 0) {
    const fov = camera.fov * (Math.PI / 180);
    const distance = (maxDim / 2) / Math.tan(fov / 2);
    camera.position.set(0, maxDim * 0.25, distance * 1.2);
    camera.lookAt(0, 0, 0);
  }
}

function initThumbnails() {
  const items = document.querySelectorAll('#lateral .item');
  items.forEach((item, idx) => {
    const key = item.dataset.mol; // 'adenina', ...
    // buscar canvas existente o crear uno
    let c = item.querySelector('canvas');
    if (!c) {
      c = document.createElement('canvas');
      item.appendChild(c);
    }
    c.width = item.clientWidth || 100;
    c.height = item.clientHeight || 100;
    c.className = 'thumb-canvas';

    const r = new THREE.WebGLRenderer({ canvas: c, antialias: true, alpha: true, powerPreference: 'low-power' });
    r.setPixelRatio(1);
    r.setSize(c.width, c.height, false);

    const s = new THREE.Scene();
    const cam = new THREE.PerspectiveCamera(40, c.width / c.height, 0.01, 50);
    cam.position.set(0, 0.3, 2);

    const hemi = new THREE.HemisphereLight(0xffffff, 0x444444, 1.1);
    s.add(hemi);

    thumbRenderers[idx] = r;
    thumbScenes[idx] = s;
    thumbCameras[idx] = cam;

    // Cargar el modelo para la miniatura
    const path = MODELS[key];
    if (!path) return;

    const localLoader = new GLTFLoader();
    localLoader.load(
      path,
      (gltf) => {
        const model = gltf.scene;
        // inicial scale
        model.scale.set(1, 1, 1);
        s.add(model);
        fitModelToCamera(model, cam);
        thumbModels[idx] = model;

        if (gltf.animations && gltf.animations.length) {
          const mixer = new THREE.AnimationMixer(model);
          gltf.animations.forEach((clip) => mixer.clipAction(clip).play());
          thumbMixers[idx] = mixer;
        }
      },
      undefined,
      (err) => console.warn('[NBases] No se pudo cargar miniatura para', key, err)
    );
  });
}

// Inicializamos miniaturas ahora que el DOM está listo
initThumbnails();

// ============================
// Drag & Drop (desde lateral)
// ============================
document.querySelectorAll('.item').forEach(el => {
  el.addEventListener('dragstart', e => {
    const key = e.currentTarget.dataset.mol; // adenina/timina/citosina/guanina
    e.dataTransfer.effectAllowed = 'copy';
    e.dataTransfer.setData('application/x-molecule', key);
    e.dataTransfer.setData('text/plain', key); // fallback
  });
});

canvas.addEventListener('dragover', e => {
  e.preventDefault();
  e.dataTransfer.dropEffect = 'copy';
});

canvas.addEventListener('drop', e => {
  e.preventDefault();
  const key = e.dataTransfer.getData('application/x-molecule') || e.dataTransfer.getData('text/plain');
  if (!key) return;
  if (!MODELS[key]) {
    console.warn(`[NBases] Molécula desconocida "${key}". Válidas: ${Object.keys(MODELS).join(', ')}`);
    return;
  }

  // Raycast al plano para saber dónde cayó
  const rect = canvas.getBoundingClientRect();
  const mouse = new THREE.Vector2(
    ((e.clientX - rect.left) / rect.width) * 2 - 1,
    -((e.clientY - rect.top) / rect.height) * 2 + 1
  );
  const raycaster = new THREE.Raycaster();
  raycaster.setFromCamera(mouse, camera);
  const hit = raycaster.intersectObject(plane, true);
  if (!hit.length) return;

  // Elegir zona más cercana con umbral
  const dropPoint = hit[0].point;
  let nearestIndex = -1, minDist = Infinity;
  dropZones.forEach((p, i) => {
    const d = p.distanceTo(dropPoint);
    if (d < minDist) { minDist = d; nearestIndex = i; }
  });
  const THRESHOLD = 1.5;
  if (nearestIndex === -1 || minDist > THRESHOLD) return; // fuera de zona

  // Si ya había algo en esa zona, lo quitamos
  if (zoneModels[nearestIndex]) {
    disposeModel(zoneModels[nearestIndex]);
    scene.remove(zoneModels[nearestIndex]);
    zoneModels[nearestIndex] = null;
    zoneState[nearestIndex] = null;
  }

  // Cargar modelo en la zona
  loader.load(
    MODELS[key],
    gltf => {
      const model = gltf.scene;
      model.scale.set(0.8, 0.8, 0.8);
      model.position.copy(dropZones[nearestIndex]);
      model.position.y = 0.01;
      model.rotation.y = Math.PI; // orientación default
      scene.add(model);

      // Animación, si existe
      if (gltf.animations && gltf.animations.length) {
        const mixer = new THREE.AnimationMixer(model);
        const action = mixer.clipAction(gltf.animations[0]);
        action.play();
        mixers.push(mixer);
      }

      zoneModels[nearestIndex] = model;
      zoneState[nearestIndex] = key;
      updatePanel();
    },
    undefined,
    err => console.error(`[NBases] Error cargando ${key} -> ${MODELS[key]}`, err)
  );
});

function disposeModel(root) {
  root.traverse(n => {
    if (n.isMesh) {
      n.geometry?.dispose?.();
      if (Array.isArray(n.material)) n.material.forEach(m => m.dispose?.());
      else n.material?.dispose?.();
    }
  });
}

// ============================
// Combinaciones específicas (5) - ACTUALIZADO CON ENLACES
// Orden de zonas: [Z1, Z2, Z3, Z4]
// ============================
const COMBOS = [
  // 1) ATCG ordenada
  {
    secuencia: ['adenina', 'timina', 'citosina', 'guanina'],
    nombre: 'Combinación ATCG',
    modelo: '/assets/models/larvae.glb',
    enlace: '/experiences/Combo1.html' // Archivo HTML del proyecto
  },
  // 2) Pares complementarios opuestos
  {
    secuencia: ['adenina', 'timina', 'guanina', 'citosina'],
    nombre: 'Pares Complementarios',
    modelo: '/assets/models/Combo2.glb',
    enlace: 'https://ejemplo.com/combo2' // Link externo
  },
  // 3) Inversión diagonal
  {
    secuencia: ['guanina', 'citosina', 'timina', 'adenina'],
    nombre: 'Inversión Diagonal',
    modelo: '/assets/models/Combo3.glb',
    enlace: '/experiences/Combo3.html' // Archivo HTML del proyecto
  },
  // 4) Simetría vertical
  {
    secuencia: ['citosina', 'citosina', 'guanina', 'guanina'],
    nombre: 'Simetría Vertical',
    modelo: '/assets/models/Combo4.glb',
    enlace: 'https://ejemplo.com/combo4' // Link externo
  },
  // 5) Todas distintas en otro orden
  {
    secuencia: ['timina', 'guanina', 'adenina', 'citosina'],
    nombre: 'Secuencia TGAC',
    modelo: '/assets/models/Combo5.glb',
    enlace: '/experiences/Combo5.html' // Archivo HTML del proyecto
  },
];

let portalArmed = false; // evita re-disparar mientras ya está activo

function checkCombinations() {
  if (!zoneState.every(Boolean) || portalArmed) return;
  const current = [...zoneState]; // [z1,z2,z3,z4]
  let matchIndex = -1;
  for (let i = 0; i < COMBOS.length; i++) {
    const combo = COMBOS[i];
    let ok = true;
    for (let j = 0; j < 4; j++) {
      if (current[j] !== combo.secuencia[j]) { ok = false; break; }
    }
    if (ok) { matchIndex = i; break; }
  }
  if (matchIndex !== -1) {
    portalArmed = true;
    const combo = COMBOS[matchIndex];
    spawnPortal(combo.modelo, combo.nombre, combo.enlace, `${combo.nombre} coincidente`);
  }
}

// ============================
// Círculo expansivo (portal) + Modal 3D con backdrop
// ============================
let circleMesh = null;
let circleActive = false;
let modalShown = false;

function spawnPortal(modelPath, comboName, comboLink, labelText = '') {
  if (circleActive || modalShown) return;

  // Círculo en el centro (XZ: 0,0)
  const circleGeo = new THREE.CircleGeometry(0.1, 64);
  const circleMat = new THREE.MeshBasicMaterial({ color: 0x000000 });
  circleMesh = new THREE.Mesh(circleGeo, circleMat);
  circleMesh.rotation.x = -Math.PI / 2;
  circleMesh.position.set(0, 0.011, 0); // un pelín sobre el plano para evitar z-fight
  scene.add(circleMesh);

  circleActive = true;
  circleMesh.scale.set(0.01, 0.01, 0.01);
  circleMesh.userData.modelPath = modelPath;
  circleMesh.userData.comboName = comboName;
  circleMesh.userData.comboLink = comboLink;
  if (labelText) updatePanel(`<i>${labelText}</i>`);
}

// Backdrop + contenedor modal (HTML)
const backdrop = document.createElement('div');
backdrop.style.position = 'absolute';
backdrop.style.inset = '0';
backdrop.style.background = 'rgba(0,0,0,0.85)';
backdrop.style.display = 'flex';
backdrop.style.alignItems = 'center';
backdrop.style.justifyContent = 'center';
backdrop.style.flexDirection = 'column';
backdrop.style.color = '#fff';
backdrop.style.fontFamily = 'Gobold, system-ui, -apple-system, Segoe UI, Roboto, sans-serif';
backdrop.style.fontSize = '18px';
backdrop.style.opacity = '0';
backdrop.style.transition = 'opacity 0.5s ease';
backdrop.style.pointerEvents = 'none';
backdrop.style.zIndex = '100';
document.body.appendChild(backdrop);

const modalCanvas = document.createElement('canvas');
modalCanvas.width = Math.floor(window.innerWidth * 0.55);
modalCanvas.height = Math.floor(window.innerHeight * 0.55);
modalCanvas.style.borderRadius = '12px';
backdrop.appendChild(modalCanvas);

const modalLink = document.createElement('a');
modalLink.href = '#'; // Se reemplaza dinámicamente
modalLink.style.display = 'block';
modalLink.style.width = '50px';
modalLink.style.height = '50px';
modalLink.style.margin = 'auto 0';
modalLink.style.marginBottom = '30px';
modalLink.style.borderRadius = '50%';
modalLink.style.backgroundColor = '#000';
modalLink.style.position = 'relative';
modalLink.style.cursor = 'pointer';
modalLink.style.boxShadow = '0 0 0 rgba(0, 0, 0, 0.7)';
modalLink.style.animation = 'pulse 2s infinite';

// Add pulse animation
const style = document.createElement('style');
style.textContent = `
  @keyframes pulse {
    0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(0, 0, 0, 0.7); }
    70% { transform: scale(1); box-shadow: 0 0 0 10px rgba(0, 0, 0, 0); }
    100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(0, 0, 0, 0); }
  }
`;
document.head.appendChild(style);

backdrop.appendChild(modalLink);

// Escena 3D del modal
let modalRenderer = null, modalScene = null, modalCamera = null, modalMixer = null, modalRoot = null;

function openModalWithModel(modelPath, comboLink = '#') {
  modalShown = true;
  backdrop.style.pointerEvents = 'auto';
  backdrop.style.opacity = '1';

  // *** ACTUALIZACIÓN DEL ENLACE DINÁMICO ***
  modalLink.href = comboLink;

  // Crear render 3D del modal
  modalRenderer = new THREE.WebGLRenderer({ canvas: modalCanvas, antialias: true, alpha: true });
  modalRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  modalRenderer.setSize(modalCanvas.width, modalCanvas.height, false);

  modalScene = new THREE.Scene();
  modalCamera = new THREE.PerspectiveCamera(45, modalCanvas.width / modalCanvas.height, 0.1, 100);
  modalCamera.position.set(0, 0, 3);

  const d = new THREE.DirectionalLight(0xffffff, 1);
  d.position.set(3, 5, 4);
  modalScene.add(d, new THREE.AmbientLight(0xffffff, 0.6));

  const localLoader = new GLTFLoader();
  localLoader.load(
    modelPath,
    (gltf) => {
      modalRoot = gltf.scene;
      modalRoot.position.set(0, 0, 0);
      modalRoot.scale.set(10, 10, 10);
      modalScene.add(modalRoot);

      if (gltf.animations && gltf.animations.length) {
        modalMixer = new THREE.AnimationMixer(modalRoot);
        const a = modalMixer.clipAction(gltf.animations[0]);
        a.play();
      }

      const spin = () => {
        if (!modalRenderer) return;
        requestAnimationFrame(spin);
        modalRoot.rotation.y += 0.01;
        if (modalMixer) modalMixer.update(1 / 60);
        modalRenderer.render(modalScene, modalCamera);
      };
      spin();
    },
    undefined,
    (err) => {
      console.warn('[NBases] No se pudo cargar el modelo modal', modelPath, err);
    }
  );

  // Click sobre el canvas del modal → seguir enlace
  modalCanvas.onclick = () => {
    // Verificar si es un enlace externo o interno
    if (modalLink.href.startsWith('http://') || modalLink.href.startsWith('https://')) {
      // Enlace externo - abrir en nueva pestaña
      window.open(modalLink.href, '_blank');
    } else {
      // Enlace interno - navegar en la misma ventana
      window.location.href = modalLink.href;
    }
  };
}

function closeModal() {
  modalShown = false;
  backdrop.style.pointerEvents = 'none';
  backdrop.style.opacity = '0';
  if (modalRenderer) {
    modalRenderer.dispose();
    modalRenderer = null;
  }
  if (modalRoot) {
    disposeModel(modalRoot);
    modalScene.remove(modalRoot);
    modalRoot = null;
  }
  modalScene = null;
  modalCamera = null;
  modalMixer = null;
  // Permitimos que se pueda volver a armar un portal con nuevas combinaciones
  portalArmed = false;
}

// Cerrar modal con ESC o clic fuera (opcional)
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });
backdrop.addEventListener('click', (e) => { if (e.target === backdrop) closeModal(); });

// ============================
// Loop principal + animación del portal
// ============================
function animate() {
  requestAnimationFrame(animate);

  const dt = clock.getDelta();
  mixers.forEach(m => m.update(dt));
  controls.update();

  // Miniaturas: anim y render
  for (let i = 0; i < thumbMixers.length; i++) {
    const tm = thumbMixers[i];
    if (tm) tm.update(dt);
  }
  for (let i = 0; i < thumbRenderers.length; i++) {
    const r = thumbRenderers[i];
    const s = thumbScenes[i];
    const c = thumbCameras[i];
    const model = thumbModels[i];
    if (r && s && c) {
      if (model && !thumbMixers[i]) model.rotation.y += 0.01; // giro fallback si no tiene mixer
      r.render(s, c);
    }
  }

  // Animación de expansión del círculo (sin invadir moléculas)
  if (circleActive && circleMesh) {
    const maxScale = 1; // suficiente para ser visible pero sin tocar zonas
    const s = circleMesh.scale.x + 0.01;
    if (s < maxScale) {
      circleMesh.scale.set(s, s, s);
    } else {
      // Portal completado → abrir modal
      const modelPath = circleMesh.userData && circleMesh.userData.modelPath;
      const comboLink = circleMesh.userData && circleMesh.userData.comboLink;
      scene.remove(circleMesh);
      circleMesh.geometry.dispose();
      circleMesh.material.dispose();
      circleMesh = null;
      circleActive = false;
      openModalWithModel(modelPath || COMBOS[0].modelo, comboLink || '#');
    }
  }

  renderer.render(scene, camera);
}
animate();

// ============================
// Resize
// ============================
function onResize() {
  const w = canvas.clientWidth;
  const h = canvas.clientHeight;
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
  renderer.setSize(w, h, false);

  // Redimensionar miniaturas
  const items = document.querySelectorAll('#lateral .item');
  items.forEach((item, i) => {
    const r = thumbRenderers[i];
    if (!r) return;
    const rectW = item.clientWidth || 100;
    const rectH = item.clientHeight || 100;
    r.setSize(rectW, rectH, false);
    if (thumbCameras[i]) {
      thumbCameras[i].aspect = rectW / rectH;
      thumbCameras[i].updateProjectionMatrix();
    }
  });

  // Redimensionar modal también
  if (modalRenderer && modalCanvas) {
    modalCanvas.width = Math.floor(window.innerWidth * 0.55);
    modalCanvas.height = Math.floor(window.innerHeight * 0.55);
    modalRenderer.setSize(modalCanvas.width, modalCanvas.height, false);
    if (modalCamera) {
      modalCamera.aspect = modalCanvas.width / modalCanvas.height;
      modalCamera.updateProjectionMatrix();
    }
  }
}
window.addEventListener('resize', onResize);