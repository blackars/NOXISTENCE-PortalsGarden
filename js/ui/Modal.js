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
            background: rgba(0, 0, 0, 0.8);
            z-index: 1000;
            justify-content: center;
            align-items: center;
            opacity: 0;
            transition: opacity 0.3s ease-in-out;
        `;

        // Crear el contenido del modal
        this.modalContent = document.createElement('div');
        this.modalContent.className = 'modal-content';
        this.modalContent.style.cssText = `
            background: #1a1a1a;
            padding: 2rem;
            border-radius: 8px;
            max-width: 80%;
            max-height: 80%;
            overflow-y: auto;
            transform: translateY(20px);
            transition: transform 0.3s ease-in-out;
            color: white;
            position: relative;
        `;

        // Botón de cierre
        this.closeButton = document.createElement('span');
        this.closeButton.className = 'close';
        this.closeButton.innerHTML = '&times;';
        this.closeButton.style.cssText = `
            position: absolute;
            top: 10px;
            right: 20px;
            font-size: 28px;
            font-weight: bold;
            cursor: pointer;
            color: #aaa;
        `;

        // Título del modal
        this.titleElement = document.createElement('h2');
        this.titleElement.className = 'modal-title';
        this.titleElement.style.marginTop = '0';

        // Cuerpo del modal
        this.bodyElement = document.createElement('div');
        this.bodyElement.className = 'modal-body';

        // Ensamblar el modal
        this.modalContent.appendChild(this.closeButton);
        this.modalContent.appendChild(this.titleElement);
        this.modalContent.appendChild(this.bodyElement);
        this.modal.appendChild(this.modalContent);
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
        if (this.isOpen || !portalData) return;
        
        this.isOpen = true;
        this.modal.style.display = 'flex';
        
        // Mostrar el cursor
        document.body.style.cursor = 'auto';
        
        // Actualizar el contenido
        this.titleElement.textContent = portalData.name || 'Proyecto';
        this.bodyElement.innerHTML = `
            <div style="display: flex; flex-direction: column; gap: 1rem;">
                <img 
                    src="${portalData.thumbnail || 'https://via.placeholder.com/300'}" 
                    alt="${portalData.name || 'Proyecto'}"
                    style="max-width: 100%; border-radius: 4px;"
                >
                <p>${portalData.description || 'Descripción no disponible.'}</p>
                ${portalData.additionalInfo ? `<div class="additional-info">${portalData.additionalInfo}</div>` : ''}
            </div>
        `;

        // Animación de entrada
        this.modal.style.opacity = '0';
        this.modalContent.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            this.modal.style.opacity = '1';
            this.modalContent.style.transform = 'translateY(0)';
        }, 10);
    }

    hide() {
        if (!this.isOpen) return;
        
        // Iniciar animación de salida
        this.modal.style.opacity = '0';
        this.modalContent.style.transform = 'translateY(20px)';
        
        // Ocultar el cursor nuevamente
        document.body.style.cursor = 'none';
        
        // Esperar a que termine la animación antes de ocultar
        setTimeout(() => {
            this.modal.style.display = 'none';
            this.isOpen = false;
            
            // Volver a bloquear el puntero después de cerrar el modal
            if (this.controls && !this.controls.isLocked) {
                this.controls.lock().catch(err => {
                    console.error('Error al bloquear el puntero:', err);
                });
            }
        }, 300);
    }
}