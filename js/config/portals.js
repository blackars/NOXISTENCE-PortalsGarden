export const PORTAL_CONFIG = [
    {
        id: 'timina-portal',
        name: 'Timina',
        modelPath: '../assets/models/Timina.glb',
        position: { x: 5, y: 0, z: -5 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: 1.0,
        description: 'Modelo 3D de Timina',
        link: 'NBases.html' // Ejemplo de archivo local en la carpeta experiences
    },
    {
        id: 'portal-1',
        name: 'Proyecto 1',
        modelPath: '../assets/models/Adenina.glb',
        position: { x: -5, y: 0, z: -5 },
        rotation: { x: 0, y: Math.PI/4, z: 0 },
        scale: 1.0,
        description: 'Descripción del proyecto 1',
        link: 'https://ejemplo.com/experiencia' // Ejemplo de enlace externo
    },
    
    // Agrega más portales según sea necesario
];