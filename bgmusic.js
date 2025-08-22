export default function createBgMusic(containerId, { position = "top-right", src = "", color = "#000000" }) {
  const container = document.getElementById(containerId);
  if (!container) {
    console.error("bgmusic.js: no se encontró el contenedor con id:", containerId);
    return;
  }

  // Crear audio
  const audio = new Audio(src);
  audio.loop = true;
  audio.preload = "auto";

  // Crear botón
  const btn = document.createElement("button");
  btn.innerHTML = speakerIcon(color); // ícono parlante inicial con color
  btn.style.position = "absolute";
  btn.style.background = "transparent";
  btn.style.border = "none";
  btn.style.cursor = "pointer";
  btn.style.padding = "5px";
  btn.style.width = "50px";
  btn.style.height = "50px";
  btn.style.zIndex = "9999";

  // Posición en viewport
  const positions = {
    "top-left": { top: "30px", left: "30px" },
    "top-right": { top: "30px", right: "30px" },
    "bottom-left": { bottom: "30px", left: "30px" },
    "bottom-right": { bottom: "30px", right: "30px" }
  };
  Object.assign(btn.style, positions[position]);

  // Hover effect
  btn.addEventListener("mouseenter", () => {
    btn.style.opacity = "0.7";
  });
  btn.addEventListener("mouseleave", () => {
    btn.style.opacity = "1";
  });

  // Toggle play/pause
  let isMuted = false;
  btn.addEventListener("click", () => {
    if (isMuted) {
      audio.play().catch(() => {});
      btn.innerHTML = speakerIcon(color);
    } else {
      audio.pause();
      btn.innerHTML = muteIcon(color);
    }
    isMuted = !isMuted;
  });

  // Reproduce al primer click en el documento
  const unlockAudio = () => {
    audio.play().catch(() => {});
    document.removeEventListener("click", unlockAudio);
  };
  document.addEventListener("click", unlockAudio);

  // Manejar visibilidad de la pestaña
  window.addEventListener("blur", () => {
    if (!audio.paused) {
      audio.pause();
    }
  });
  window.addEventListener("focus", () => {
    if (!isMuted) {
      audio.play().catch(() => {});
    }
  });

  // Agregar al contenedor
  container.appendChild(btn);
}

// SVG parlante dinámico
function speakerIcon(color) {
  return `
    <svg xmlns="http://www.w3.org/2000/svg" fill="${color}" viewBox="0 0 24 24">
      <path d="M4 9v6h4l5 5V4L8 9H4z"/>
    </svg>
  `;
}

// SVG mute dinámico
function muteIcon(color) {
  return `
    <svg xmlns="http://www.w3.org/2000/svg" fill="${color}" viewBox="0 0 24 24">
      <path d="M16.5 12l4.5 4.5-1.5 1.5L15 13.5l-4.5 4.5V6l4.5 4.5 4.5-4.5 1.5 1.5L16.5 12z"/>
    </svg>
  `;
}
