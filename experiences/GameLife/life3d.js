import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export function initLife3D(container) {
  // Configuration
  const size = 20; // N x N grid
  let running = false;
  let speed = 5; // generations per second

  // Scene, camera, renderer
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0xffffff);

  const camera = new THREE.PerspectiveCamera(60, container.clientWidth / container.clientHeight, 0.1, 1000);
  camera.position.set(size * 1, size * 1, size * 1);
  camera.lookAt(0, 0, 0);

  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio || 1);
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setClearColor(0xffffff);
  container.appendChild(renderer.domElement);

  // Orbit controls
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;

  // Lights
  const dir = new THREE.DirectionalLight(0xffffff, 1.1);
  dir.position.set(1, 2, 1);
  scene.add(dir);
  scene.add(new THREE.AmbientLight(0x909090));

  // Grid helper so user sees plane
  const gridHelper = new THREE.GridHelper(size, size, 0x222222, 0x000000);
  gridHelper.position.y = -0.5; // slightly below cells
  scene.add(gridHelper);

  // Invisible click plane on XZ at y=0
  const clickPlane = new THREE.Mesh(
    new THREE.PlaneGeometry(size, size),
    new THREE.MeshBasicMaterial({ visible: false })
  );
  clickPlane.rotation.x = -Math.PI / 2;
  scene.add(clickPlane);

  // Cell geometry/material
  const cellGeo = new THREE.SphereGeometry(0.35, 12, 12);
  const cellMat = new THREE.MeshStandardMaterial({ color: 0x000000, roughness: 0.6, metalness: 0.1 });

  // Grid state and meshes (2D board on XZ)
  let grid = createEmptyGrid(size);
  const meshes = Array.from({ length: size }, () => Array.from({ length: size }, () => null));

  function createEmptyGrid(n) {
    return Array.from({ length: n }, () => Array.from({ length: n }, () => 0));
  }

  function renderGrid() {
    // update meshes for 2D grid on XZ plane (y = 0)
    for (let x = 0; x < size; x++) {
      for (let z = 0; z < size; z++) {
        const alive = !!grid[x][z];
        let m = meshes[x][z];
        if (alive && !m) {
          m = new THREE.Mesh(cellGeo, cellMat.clone());
          m.position.set(x - size / 2 + 0.5, 0, z - size / 2 + 0.5);
          scene.add(m);
          meshes[x][z] = m;
        } else if (!alive && m) {
          scene.remove(m);
          meshes[x][z] = null;
        }
      }
    }
  }

  function randomizeGrid() {
    for (let x = 0; x < size; x++) {
      for (let z = 0; z < size; z++) {
        grid[x][z] = Math.random() > 0.75 ? 1 : 0;
      }
    }
    renderGrid();
  }

  function clearGrid() {
    grid = createEmptyGrid(size);
    renderGrid();
  }

  // Classic Conway Game of Life rules on 2D torus
  function stepSimulation() {
    const next = createEmptyGrid(size);
    for (let x = 0; x < size; x++) {
      for (let z = 0; z < size; z++) {
        let neighbors = 0;
        for (let dx = -1; dx <= 1; dx++) {
          for (let dz = -1; dz <= 1; dz++) {
            if (dx === 0 && dz === 0) continue;
            const nx = (x + dx + size) % size;
            const nz = (z + dz + size) % size;
            neighbors += grid[nx][nz];
          }
        }
        if (grid[x][z]) {
          next[x][z] = (neighbors === 2 || neighbors === 3) ? 1 : 0;
        } else {
          next[x][z] = (neighbors === 3) ? 1 : 0;
        }
      }
    }
    grid = next;
    renderGrid();
  }

  // Pointer painting (click & drag) with stable mapping
  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();
  let isPointerDown = false;
  let lastPaint = { gx: -1, gz: -1 };

  function pointerToGrid(clientX, clientY) {
    const rect = renderer.domElement.getBoundingClientRect();
    pointer.x = ((clientX - rect.left) / rect.width) * 2 - 1;
    pointer.y = -((clientY - rect.top) / rect.height) * 2 + 1;
    raycaster.setFromCamera(pointer, camera);
    const hit = raycaster.intersectObject(clickPlane, false)[0];
    if (!hit) return null;
    const p = hit.point;
    const gx = Math.floor(p.x + size / 2);
    const gz = Math.floor(p.z + size / 2);
    if (gx < 0 || gx >= size || gz < 0 || gz >= size) return null;
    return { gx, gz };
  }

  renderer.domElement.addEventListener('pointerdown', (e) => {
    isPointerDown = true;
    lastPaint = { gx: -1, gz: -1 };
    const g = pointerToGrid(e.clientX, e.clientY);
    if (g) {
      grid[g.gx][g.gz] = grid[g.gx][g.gz] ? 0 : 1; // toggle on pointerdown
      renderGrid();
      lastPaint = g;
    }
  });
  window.addEventListener('pointerup', () => { isPointerDown = false; lastPaint = { gx: -1, gz: -1 }; });
  renderer.domElement.addEventListener('pointermove', (e) => {
    if (!isPointerDown) return;
    const g = pointerToGrid(e.clientX, e.clientY);
    if (g && (g.gx !== lastPaint.gx || g.gz !== lastPaint.gz)) {
      grid[g.gx][g.gz] = 1; // paint alive while dragging
      renderGrid();
      lastPaint = g;
    }
  });

  // Responsive resize
  window.addEventListener('resize', () => {
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
  });

  // UI auto-wire (if elements exist)
  function safeGet(id) { try { return document.getElementById(id); } catch { return null; } }
  const btnToggle = safeGet('toggle');
  const btnStep = safeGet('step');
  const btnRandom = safeGet('random');
  const btnClear = safeGet('clear');
  const speedSlider = safeGet('speed');
  const iconToggle = safeGet('icon-toggle');

  if (btnToggle) {
    // initial icon (play)
    if (iconToggle) iconToggle.innerHTML = '<polygon points="5,3 19,12 5,21"/>';
    btnToggle.addEventListener('click', () => {
      running = !running;
      if (iconToggle) {
        iconToggle.innerHTML = running
          ? '<rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/>'
          : '<polygon points="5,3 19,12 5,21"/>';
      }
    });
  }

  if (btnStep) btnStep.addEventListener('click', () => { stepSimulation(); });
  if (btnRandom) btnRandom.addEventListener('click', () => { randomizeGrid(); });
  if (btnClear) btnClear.addEventListener('click', () => { clearGrid(); });
  if (speedSlider) speedSlider.addEventListener('input', (e) => { speed = parseInt(e.target.value, 10) || 5; });

  // Animation loop using accumulator to avoid timing drift
  let accumulator = 0;
  const clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);
    const delta = clock.getDelta();
    if (running) {
      accumulator += delta;
      const interval = 1 / speed;
      while (accumulator >= interval) {
        stepSimulation();
        accumulator -= interval;
      }
    } else {
      accumulator = 0; // reset when paused
    }
    controls.update();
    renderer.render(scene, camera);
  }
  animate();

  // initial state
  renderGrid();

  // Expose API
  return {
    play() { running = true; },
    pause() { running = false; },
    toggle() { running = !running; },
    step() { stepSimulation(); },
    randomize() { randomizeGrid(); },
    clear() { clearGrid(); },
    setSpeed(v) { speed = v; }
  };
}
