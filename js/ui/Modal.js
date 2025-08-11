export class Modal {
    constructor(controls = null) {
        this.isOpen = false;
        this.controls = controls;
        this.createModal();
        this.addEventListeners();
    }

    createModal() {
        // Crear el contenedor del modal
        this.modal = document.createElement('div');
        this.modal.className = 'modal';
        this.modal.style.cssText = `
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.9);
            z-index: 1000;
            justify-content: center;
            align-items: center;
            opacity: 0;
            transition: opacity 0.5s ease-in-out;
            overflow: hidden;
        `;
        
        // Crear el contenedor del círculo
        this.circleContainer = document.createElement('div');
        this.circleContainer.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
            pointer-events: none;
        `;
        
        // Crear el círculo central
        this.circle = document.createElement('div');
        this.circle.className = 'modal-circle';
        this.circle.style.cssText = `
            position: relative;
            width: 0;
            height: 0;
            background: rgba(0, 0, 0, 0.9);
            border-radius: 50%;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            color: white;
            padding: 2rem;
            box-sizing: border-box;
            transform: scale(1);
            animation: pulse 3s ease-in-out infinite;
            pointer-events: auto;
        `;
        
        // Añadir keyframes directamente en el estilo
        const style = document.createElement('style');
        style.textContent = `
            @keyframes pulse {
                0% { transform: scale(1); }
                50% { transform: scale(1.1); }
                100% { transform: scale(1); }
            }
        `;
        document.head.appendChild(style);
        
        // Contenido del modal
        this.content = document.createElement('div');
        this.content.className = 'modal-content';
        this.content.style.cssText = `
            opacity: 0;
            transition: opacity 0.3s ease-in-out 0.3s;
            text-align: center;
            max-width: 80%;
        `;
        
        this.title = document.createElement('h2');
        this.title.className = 'modal-title';
        this.title.style.cssText = `
            margin: 0 0 1rem 0;
            font-size: 2rem;
            text-transform: uppercase;
            letter-spacing: 2px;
        `;
        
        this.description = document.createElement('p');
        this.description.className = 'modal-description';
        this.description.style.cssText = `
            margin: 0 0 1.5rem 0;
            line-height: 1.5;
        `;
        
        // Crear contenedor para los botones
        this.buttonsContainer = document.createElement('div');
        this.buttonsContainer.style.cssText = `
            display: flex;
            gap: 1rem;
            margin-top: 1.5rem;
            justify-content: center;
        `;

        // Botón Abrir
        this.openButton = document.createElement('button');
        this.openButton.className = 'modal-open';
        this.openButton.textContent = 'Open';
        this.openButton.style.cssText = `
            background:rgb(255, 255, 255);
            border: 1px solid white;
            color: black;
            padding: 0.5rem 1.5rem;
            font-size: 1rem;
            cursor: pointer;
            transition: all 0.3s ease;
            border-radius: 20px;
            outline: none;
        `;
        
        this.openButton.addEventListener('mouseover', () => {
            this.openButton.style.background = 'rgb(255, 255, 255)';
            this.openButton.style.transform = 'scale(1.1)';
        });
        
        this.openButton.addEventListener('mouseout', () => {
            this.openButton.style.background = 'rgb(255, 255, 255)';
            this.openButton.style.transform = 'scale(1)';
        });

        // Botón Cerrar
        this.closeButton = document.createElement('button');
        this.closeButton.className = 'modal-close';
        this.closeButton.textContent = 'Close';
        this.closeButton.style.cssText = `
            background: transparent;
            border: 1px solid white;
            color: white;
            padding: 0.5rem 1.5rem;
            font-size: 1rem;
            cursor: pointer;
            transition: all 0.3s ease;
            border-radius: 20px;
            outline: none;
        `;
        
        this.closeButton.addEventListener('mouseover', () => {
            this.closeButton.style.background = 'white';
            this.closeButton.style.color = 'black';
            this.closeButton.style.transform = 'scale(1.05)';
        });
        
        this.closeButton.addEventListener('mouseout', () => {
            this.closeButton.style.background = 'transparent';
            this.closeButton.style.color = 'white';
            this.closeButton.style.transform = 'scale(1)';
        });
        
        // Añadir elementos al contenido
        this.content.appendChild(this.title);
        this.content.appendChild(this.description);
        
        // Añadir botones al contenedor
        this.buttonsContainer.appendChild(this.openButton);
        this.buttonsContainer.appendChild(this.closeButton);
        this.content.appendChild(this.buttonsContainer);
        
        // Añadir elementos al DOM
        this.circle.appendChild(this.content);
        this.circleContainer.appendChild(this.circle);
        this.modal.appendChild(this.circleContainer);
        document.body.appendChild(this.modal);
    }

    addEventListeners() {
        // Cerrar al hacer clic en la X
        this.closeButton.onclick = () => this.hide();
        
        // Cerrar al hacer clic fuera del contenido
        this.modal.onclick = (e) => {
            if (e.target === this.modal) this.hide();
        };

        // Cerrar con la tecla Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.hide();
            }
        });
    }

    show(portalData) {
        if (!portalData) return;
        
        this.isOpen = true;
        this.modal.style.display = 'flex';
        
        // Actualizar el contenido
        if (portalData.name) this.title.textContent = portalData.name;
        if (portalData.description) this.description.textContent = portalData.description;
        
        // Configurar el botón de abrir si hay un enlace
        if (portalData.link) {
            this.openButton.style.display = 'inline-block';
            this.openButton.onclick = () => {
                // Verificar si es un enlace externo (http:// o https://)
                if (portalData.link.startsWith('http://') || portalData.link.startsWith('https://')) {
                    // Es un enlace externo, abrir en una nueva pestaña
                    window.open(portalData.link, '_blank');
                } else {
                    // Es un archivo local, construir la ruta a la carpeta experiences
                    const experiencePath = `../experiences/${portalData.link}`;
                    window.open(experiencePath, '_blank');
                }
                this.hide();
            };
        } else {
            this.openButton.style.display = 'none';
        }
        
        // Forzar reflow para permitir la transición
        void this.modal.offsetWidth;
        
        // Animar la aparición
        this.modal.style.opacity = '1';
        
        // Animar el círculo
        setTimeout(() => {
            const size = Math.min(window.innerWidth, window.innerHeight) * 0.8;
            this.circle.style.width = `${size}px`;
            this.circle.style.height = `${size}px`;
            
            // Mostrar contenido después de la animación del círculo
            setTimeout(() => {
                this.content.style.opacity = '1';
            }, 300);
        }, 10);
        
        // Desbloquear el cursor
        document.body.style.cursor = 'auto';
        
        // Desbloquear los controles
        if (this.controls) {
            this.controls.unlock();
        }
    }

    hide() {
        // Ocultar el contenido del modal con la misma duración que la animación del círculo
        this.content.style.transition = 'opacity 0.3s ease-out';
        this.content.style.opacity = '0';
        
        // Reducir el círculo
        this.circle.style.transition = 'width 0.4s ease-out, height 0.4s ease-out';
        this.circle.style.width = '0';
        this.circle.style.height = '0';
        
        // Ocultar el fondo con un ligero retraso
        setTimeout(() => {
            this.modal.style.transition = 'opacity 0.3s ease-out';
            this.modal.style.opacity = '0';
        }, 50);
        
        // Esperar a que terminen las animaciones
        setTimeout(() => {
            this.modal.style.display = 'none';
            
            // Restaurar estilos de transición
            this.content.style.transition = '';
            this.circle.style.transition = '';
            this.modal.style.transition = '';
            
            // Restaurar el cursor al cerrar
            document.body.style.cursor = 'none';
            
            // Volver a bloquear los controles
            if (this.controls) {
                this.controls.lock();
            }
            this.cleanup();
        }, 400); // Reducido de 500ms a 400ms para que coincida con la animación del círculo
    }

    cleanup() {
        // No es necesario hacer nada aquí por ahora
    }
}