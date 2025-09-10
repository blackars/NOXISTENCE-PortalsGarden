function u(n,{position:c="top-right",src:p="",color:s="#000000"}){const i=document.getElementById(n);if(!i){console.error("bgmusic.js: no se encontró el contenedor con id:",n);return}const e=new Audio(p);e.loop=!0,e.preload="auto";const t=document.createElement("button");t.innerHTML=r(s),t.style.position="absolute",t.style.background="transparent",t.style.border="none",t.style.cursor="pointer",t.style.padding="5px",t.style.width="50px",t.style.height="50px",t.style.zIndex="9999";const d={"top-left":{top:"30px",left:"30px"},"top-right":{top:"30px",right:"30px"},"bottom-left":{bottom:"30px",left:"30px"},"bottom-right":{bottom:"30px",right:"30px"}};Object.assign(t.style,d[c]),t.addEventListener("mouseenter",()=>{t.style.opacity="0.7"}),t.addEventListener("mouseleave",()=>{t.style.opacity="1"});let o=!1;t.addEventListener("click",()=>{o?(e.play().catch(()=>{}),t.innerHTML=r(s)):(e.pause(),t.innerHTML=a(s)),o=!o});const l=()=>{e.play().catch(()=>{}),document.removeEventListener("click",l)};document.addEventListener("click",l),window.addEventListener("blur",()=>{e.paused||e.pause()}),window.addEventListener("focus",()=>{o||e.play().catch(()=>{})}),i.appendChild(t)}function r(n){return`
    <svg xmlns="http://www.w3.org/2000/svg" fill="${n}" viewBox="0 0 24 24">
      <path d="M4 9v6h4l5 5V4L8 9H4z"/>
    </svg>
  `}function a(n){return`
    <svg xmlns="http://www.w3.org/2000/svg" fill="${n}" viewBox="0 0 24 24">
      <path d="M16.5 12l4.5 4.5-1.5 1.5L15 13.5l-4.5 4.5V6l4.5 4.5 4.5-4.5 1.5 1.5L16.5 12z"/>
    </svg>
  `}export{u as c};
