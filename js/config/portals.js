export const PORTAL_CONFIG = [
    {
        id: 'LifeGame',
        name: "Life's Game",
        modelPath: '../assets/models/PortalCube.glb',
        position: { x: 5, y: 0, z: -5 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: 1.0,
        description: 'El Juego de la Vida',
        link: 'LifeGame.html' // Ejemplo de archivo local en la carpeta experiences
    },
    {
        id: 'portal-1',
        name: 'Proyecto 1',
        modelPath: '../assets/models/PortalCube.glb',
        position: { x: -5, y: 0, z: -5 },
        rotation: { x: 0, y: Math.PI/4, z: 0 },
        scale: 1.0,
        description: 'Descripción del proyecto 1',
        link: 'https://ejemplo.com/experiencia' // Ejemplo de enlace externo
    },
    
    // Agrega más portales según sea necesario
];