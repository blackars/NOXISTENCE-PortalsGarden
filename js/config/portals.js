// Portals configuration
export const PORTAL_CONFIG = [
    {
        id: 'portal-1',
        name: "Clean Squared Place",
        modelPath: '/assets/models/PortalCube.glb',
        position: { x: -45, y: 4, z: -45 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: 1.0,
        sphereDiameter: 3.0,
        description: 'Ephemeral existences, molecular arrangements with wills that die and reveal essential elements for creation.',
        link: 'clean-squaredplace/cleansquaredplace.html'
    },
    {
        id: 'portal-2',
        name: 'Nitrogenous Bases',
        modelPath: '/assets/models/NBasesPortal.glb',
        position: { x: 5, y: 10, z: -45 },
        rotation: { x: 0, y: Math.PI/4, z: 0 },
        scale: 6.0,
        sphereDiameter: 1.0,
        description: 'In the depths of molecular existence, every experience whispers the primordial secrets of life.',
        link: 'n-bases/nbases.html'
    },
    {
        id: 'portal-3',
        name: 'Game of Life',
        modelPath: '/assets/models/PortalSphere.glb',
        position: { x: 45, y: 4, z: -45 },
        rotation: { x: 0, y: Math.PI/4, z: 0 },
        scale: 1.0,
        sphereDiameter: 3.0,
        description: 'In the perpetual dance of creation and destruction, each cell is a verse of the universal poem. Simple rules give rise to infinite complexities, reflecting the mystery of how life emerges from the void and returns to it.',
        link: 'game-life/gameoflife.html'
    },
    {
        id: 'portal-4',
        name: 'AnothEarth',
        modelPath: '/assets/models/AnothEarth.glb',
        position: { x: -45, y: 7, z: 5 },
        rotation: { x: 0, y: Math.PI/4, z: 0 },
        scale: 0.02,
        sphereDiameter: 230.0,  // Esfera más grande para este modelo
        description: 'A distorted mirror of our own world, where reality intertwines with fantasy. What if Earth had a lost twin in the multiverse?',
        link: 'AnothEarth/anothearth.html'
    },
    {
        id: 'portal-5',
        name: 'Maxkodia',
        modelPath: '/assets/models/MaxkodiaPlanet.glb',
        position: { x: 45, y: 8, z: 5 },
        rotation: { x: 0, y: Math.PI/4, z: 0 },
        scale: 0.05,
        sphereDiameter: 120.0,  // Esfera más grande para este modelo
        description: 'Brought forth from the depths of the cosmos, where time bends upon itself and now trapped here, there exists a planet that holds the secrets of civilizations that never came to be.',
        link: 'maxkodiaplanet/maxkodiaplanet.html'
    },

    {
        id: 'portal-6',
        name: 'Space Words',
        modelPath: '/assets/models/skybox.glb',
        position: { x: -45, y: 4, z: 45 },
        rotation: { x: 0, y: Math.PI/4, z: 0 },
        scale: 2.0,
        description: 'Can we capture the infinite within language?',
        link: 'space-words/spacewords.html'
    },
    {
        id: 'portal-7',
        name: 'Gardhan Thinker',
        modelPath: '/assets/models/brain.glb',
        position: { x: 5, y: 8, z: 45 },
        rotation: { x: 0, y: Math.PI, z: 0 },
        scale: 5.0,
        sphereDiameter: 1.0,  // Esfera más grande para este modelo
        description: 'A labyrinth of thoughts where consciousness meets the pure essence of contemplation. A space where time stands still and only the act of thinking remains.',
        link: 'thinker/thinker.html'
    },

    {
        id: 'portal-8',
        name: 'Deep Space',
        modelPath: '/assets/models/ship.glb',
        position: { x: 45, y: 4.5, z: 45 },
        rotation: { x: 0, y: Math.PI/8, z: 0 },
        scale: 0.7,
        sphereDiameter: 5.0,  // Esfera más grande para este modelo
        description: 'In the depths of the cosmos, where time is but a memory and space an illusion, we come face to face with what we truly are: travelers of darkness seeking light in the abyss, where only nonexistence awaits us.',
        link: 'deepspace/deepspace.html'
    },
    
    // Agrega más portales según sea necesario
];