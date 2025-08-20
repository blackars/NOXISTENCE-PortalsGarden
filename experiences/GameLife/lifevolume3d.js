import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

// Tamaño del volumen 3D
const SIZE = 20;
let scene, camera, renderer, controls;
let cubes = [];
let grid = [];
let nextGrid = [];
let isRunning = false;
let interval;
let speed = 500;

init();

function init() {
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x111111);

  camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(SIZE, SIZE, SIZE * 2);

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;

  createGrid();
  animate();

  document.getElementById('playPause').addEventListener('click', togglePlay);
  document.getElementById('random').addEventListener('click', randomize);
  document.getElementById('clear').addEventListener('click', clearGrid);
  document.getElementById('speed').addEventListener('input', e => {
    speed = 1000 - e.target.value;
    if (isRunning) restartInterval();
  });

  window.addEventListener('resize', onWindowResize);
}

function createGrid() {
  const geometry = new THREE.BoxGeometry(0.9, 0.9, 0.9);
  const materialAlive = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
  const materialDead = new THREE.MeshStandardMaterial({ color: 0x111111 });

  const light = new THREE.PointLight(0xffffff, 1);
  light.position.set(SIZE, SIZE * 2, SIZE);
  scene.add(light);

  const ambient = new THREE.AmbientLight(0xffffff, 0.4);
  scene.add(ambient);

  for (let x = 0; x < SIZE; x++) {
    grid[x] = [];
    nextGrid[x] = [];
    cubes[x] = [];
    for (let y = 0; y < SIZE; y++) {
      grid[x][y] = [];
      nextGrid[x][y] = [];
      cubes[x][y] = [];
      for (let z = 0; z < SIZE; z++) {
        grid[x][y][z] = 0;
        nextGrid[x][y][z] = 0;
        const cube = new THREE.Mesh(geometry, materialDead.clone());
        cube.position.set(x - SIZE / 2, y - SIZE / 2, z - SIZE / 2);
        scene.add(cube);
        cubes[x][y][z] = cube;
      }
    }
  }
}

function randomize() {
  for (let x = 0; x < SIZE; x++) {
    for (let y = 0; y < SIZE; y++) {
      for (let z = 0; z < SIZE; z++) {
        grid[x][y][z] = Math.random() > 0.8 ? 1 : 0;
        updateCube(x, y, z);
      }
    }
  }
}

function clearGrid() {
  for (let x = 0; x < SIZE; x++) {
    for (let y = 0; y < SIZE; y++) {
      for (let z = 0; z < SIZE; z++) {
        grid[x][y][z] = 0;
        updateCube(x, y, z);
      }
    }
  }
}

function updateCube(x, y, z) {
  cubes[x][y][z].material.color.set(grid[x][y][z] ? 0x00ff00 : 0x111111);
}

function step() {
  for (let x = 0; x < SIZE; x++) {
    for (let y = 0; y < SIZE; y++) {
      for (let z = 0; z < SIZE; z++) {
        let neighbors = countNeighbors(x, y, z);
        if (grid[x][y][z] === 1) {
          nextGrid[x][y][z] = (neighbors === 2 || neighbors === 3) ? 1 : 0;
        } else {
          nextGrid[x][y][z] = (neighbors === 3) ? 1 : 0;
        }
      }
    }
  }

  for (let x = 0; x < SIZE; x++) {
    for (let y = 0; y < SIZE; y++) {
      for (let z = 0; z < SIZE; z++) {
        grid[x][y][z] = nextGrid[x][y][z];
        updateCube(x, y, z);
      }
    }
  }
}

function countNeighbors(x, y, z) {
  let count = 0;
  for (let dx = -1; dx <= 1; dx++) {
    for (let dy = -1; dy <= 1; dy++) {
      for (let dz = -1; dz <= 1; dz++) {
        if (dx === 0 && dy === 0 && dz === 0) continue;
        let nx = x + dx, ny = y + dy, nz = z + dz;
        if (nx >= 0 && nx < SIZE && ny >= 0 && ny < SIZE && nz >= 0 && nz < SIZE) {
          count += grid[nx][ny][nz];
        }
      }
    }
  }
  return count;
}

function togglePlay() {
  isRunning = !isRunning;
  const btn = document.getElementById('playPause');
  btn.textContent = isRunning ? '⏸️' : '▶️';
  if (isRunning) {
    restartInterval();
  } else {
    clearInterval(interval);
  }
}

function restartInterval() {
  clearInterval(interval);
  interval = setInterval(step, speed);
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}
