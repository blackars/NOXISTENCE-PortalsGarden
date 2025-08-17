import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export class NBasesScene {
  constructor(container) {
    this.container = container;
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xffffff);

    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.camera.position.set(0, 20, 30);

    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(this.renderer.domElement);

    this.loader = new GLTFLoader();
    this.clock = new THREE.Clock();

    this.molecules = {};
    this.draggedMolecule = null;

    this.initScene();
    this.loadMolecules();
    this.setupEventListeners();
    this.animate();
  }

  initScene() {
    const planeSize = 20;
    const geometry = new THREE.PlaneGeometry(planeSize, planeSize, 2, 2);
    const material = new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide });
    this.plane = new THREE.Mesh(geometry, material);
    this.plane.rotation.x = -Math.PI / 2;
    this.scene.add(this.plane);

    const edges = new THREE.EdgesGeometry(geometry);
    const line = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color: 0x000000 }));
    line.rotation.x = -Math.PI / 2;
    this.scene.add(line);

    this.sections = [
      new THREE.Vector3(-5, 0, -5),
      new THREE.Vector3(5, 0, -5),
      new THREE.Vector3(-5, 0, 5),
      new THREE.Vector3(5, 0, 5)
    ];

    this.sections.forEach(pos => {
      const triGeom = new THREE.ConeGeometry(0.5, 0.5, 3);
      const triMat = new THREE.MeshBasicMaterial({ color: 0x000000 });
      const tri = new THREE.Mesh(triGeom, triMat);
      tri.position.copy(pos);
      tri.position.y = 0.25;
      this.scene.add(tri);
    });

    const ambient = new THREE.AmbientLight(0xffffff, 0.7);
    this.scene.add(ambient);

    const dirLight = new THREE.DirectionalLight(0xffffff, 0.5);
    dirLight.position.set(10, 20, 10);
    this.scene.add(dirLight);
  }

  loadMolecules() {
    const names = ['Adenina', 'Tiamina', 'Citosina', 'Guanina'];
    names.forEach((name, i) => {
      this.loader.load(`/assets/models/${name}.glb`, gltf => {
        const molecule = gltf.scene;
        molecule.scale.set(0.5, 0.5, 0.5);
        molecule.position.set(-12, 0.5, i * -3 + 4.5);
        molecule.userData.name = name;
        this.scene.add(molecule);
        this.molecules[name] = molecule;
      });
    });
  }

  setupEventListeners() {
    window.addEventListener('pointerdown', e => {
      // Detect click on molecule icons
      // ... código para seleccionar arrastre ...
    });
    window.addEventListener('pointermove', e => {
      if (this.draggedMolecule) {
        // Actualizar posición siguiendo cursor
      }
    });
    window.addEventListener('pointerup', e => {
      if (this.draggedMolecule) {
        // Verificar si cae en sección válida
        // Si no se aproxima, abortar arrastre
        this.draggedMolecule = null;
      }
    });
  }

  animate() {
    requestAnimationFrame(() => this.animate());
    this.renderer.render(this.scene, this.camera);
  }
}
