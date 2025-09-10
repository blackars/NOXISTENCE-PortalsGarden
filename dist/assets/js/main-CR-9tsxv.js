import"./modulepreload-polyfill-B5Qt9EMX.js";import{G as $,R as q,V as L,C as R,B as D,M as v,a as E,S as j,D as H,b as N,A as _,c as F,d as M,P as K,e as U,f as V,g as X,h as Z,i as J,W as Q,j as Y,k as T}from"./vendor_three-C7fBU5eI.js";function ee(a,{position:e="top-right",src:n="",color:i="#000000"}){const s=document.getElementById(a);if(!s){console.error("bgmusic.js: no se encontró el contenedor con id:",a);return}const t=new Audio(n);t.loop=!0,t.preload="auto";const o=document.createElement("button");o.innerHTML=A(i),o.style.position="absolute",o.style.background="transparent",o.style.border="none",o.style.cursor="pointer",o.style.padding="5px",o.style.width="50px",o.style.height="50px",o.style.zIndex="9999";const r={"top-left":{top:"30px",left:"30px"},"top-right":{top:"30px",right:"30px"},"bottom-left":{bottom:"30px",left:"30px"},"bottom-right":{bottom:"30px",right:"30px"}};Object.assign(o.style,r[e]),o.addEventListener("mouseenter",()=>{o.style.opacity="0.7"}),o.addEventListener("mouseleave",()=>{o.style.opacity="1"});let l=!1;o.addEventListener("click",()=>{l?(t.play().catch(()=>{}),o.innerHTML=A(i)):(t.pause(),o.innerHTML=te(i)),l=!l});const m=()=>{t.play().catch(()=>{}),document.removeEventListener("click",m)};document.addEventListener("click",m),window.addEventListener("blur",()=>{t.paused||t.pause()}),window.addEventListener("focus",()=>{l||t.play().catch(()=>{})}),s.appendChild(o)}function A(a){return`
    <svg xmlns="http://www.w3.org/2000/svg" fill="${a}" viewBox="0 0 24 24">
      <path d="M4 9v6h4l5 5V4L8 9H4z"/>
    </svg>
  `}function te(a){return`
    <svg xmlns="http://www.w3.org/2000/svg" fill="${a}" viewBox="0 0 24 24">
      <path d="M16.5 12l4.5 4.5-1.5 1.5L15 13.5l-4.5 4.5V6l4.5 4.5 4.5-4.5 1.5 1.5L16.5 12z"/>
    </svg>
  `}ee("music",{position:"top-right",color:"#000000",src:"/sounds/ambient.mp3"});const oe="modulepreload",se=function(a){return"/"+a},O={},ne=function(e,n,i){let s=Promise.resolve();if(n&&n.length>0){document.getElementsByTagName("link");const o=document.querySelector("meta[property=csp-nonce]"),r=(o==null?void 0:o.nonce)||(o==null?void 0:o.getAttribute("nonce"));s=Promise.allSettled(n.map(l=>{if(l=se(l),l in O)return;O[l]=!0;const m=l.endsWith(".css"),g=m?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${l}"]${g}`))return;const h=document.createElement("link");if(h.rel=m?"stylesheet":oe,m||(h.as="script"),h.crossOrigin="",h.href=l,r&&h.setAttribute("nonce",r),document.head.appendChild(h),m)return new Promise((k,p)=>{h.addEventListener("load",k),h.addEventListener("error",()=>p(new Error(`Unable to preload CSS for ${l}`)))})}))}function t(o){const r=new Event("vite:preloadError",{cancelable:!0});if(r.payload=o,window.dispatchEvent(r),!r.defaultPrevented)throw o}return s.then(o=>{for(const r of o||[])r.status==="rejected"&&t(r.reason);return e().catch(t)})};class ie{constructor(e,n){console.log("Inicializando PortalManager..."),this.scene=e,this.onPortalClick=n,this.portals=new Map,this.loader=new $,this.raycaster=new q,this.mouse=new L,this.controls=null,this.camera=null,this.mixers=[],this.clock=new R,this.loader.manager.onError=i=>{console.error("Error cargando recurso:",i)},this.handleClick=this.handleClick.bind(this),this.animate()}animate(){requestAnimationFrame(()=>this.animate());const e=this.clock.getDelta();for(const n of this.mixers)n.update(e);this.updateSphereEffects()}setControls(e){return this.controls=e,this}setCamera(e){return this.camera=e,this}async loadPortals(e){for(const n of e)console.log(`Cargando portal: ${n.id} desde ${n.modelPath}`),this.loadModel(n)}createMarker(e){const n=new D(1,1,1),i=new v({color:65280,wireframe:!0,transparent:!0,opacity:.8}),s=new E(n,i);return s.position.set(e.position.x,e.position.y,e.position.z),s.scale.set(.5,.5,.5),s.userData={isPortal:!0,portalData:e,isPlaceholder:!0},s}createSphereEffect(e){const n=e.sphereDiameter||1.5,i=new j(n,32,32),s=new v({color:0,transparent:!0,opacity:.3,side:H}),t=new E(i,s);return t.userData={isPortal:!0,portalData:e,isEffect:!0},t.userData.pulseSpeed=.7+Math.random()*.6,t.userData.scaleIntensity=.25,t.userData.baseOpacity=.35,t.userData.opacityIntensity=.75,t}updateSphereEffects(){const e=this.clock.getElapsedTime();this.portals.forEach(n=>{var s;const i=n.effect||((s=n.userData)!=null&&s.isEffect?n:null);if(i){const t=i.userData.pulseSpeed||.8,o=i.userData.scaleIntensity||.15,r=i.userData.baseOpacity||.25,l=i.userData.opacityIntensity||.15,g=1+(Math.sin(e*t)*.5+.5)*o,h=Math.sin(e*(t*.8)+1)*.5+.5,k=r+h*l;i.scale.setScalar(g),i.material.opacity=Math.min(1,Math.max(0,k))}})}loadModel(e){return console.log(`Cargando modelo: ${e.id} desde ${e.modelPath}`),new Promise((n,i)=>{this.loader.load(e.modelPath,s=>{var g,h,k;console.log(`✅ Modelo cargado: ${e.id}`);const t=new N;t.position.set(e.position.x,e.position.y,e.position.z),t.rotation.set(((g=e.rotation)==null?void 0:g.x)||0,((h=e.rotation)==null?void 0:h.y)||0,((k=e.rotation)==null?void 0:k.z)||0);const o=e.scale||1;t.scale.set(o,o,o);const r=s.scene;if(s.animations&&s.animations.length>0){console.log(`🔍 Se encontraron ${s.animations.length} animaciones`);const p=new _(r);this.mixers.push(p),s.animations.forEach(I=>{console.log(`▶️ Reproduciendo animación: ${I.name}`),p.clipAction(I).play()}),r.userData.mixer=p}else console.log("ℹ️ No se encontraron animaciones en el modelo");r.traverse(p=>{p.isMesh&&(p.castShadow=!0,p.receiveShadow=!0,p.userData={isPortal:!0,portalData:e})});const l=this.createSphereEffect(e);t.add(r),t.add(l),this.scene.add(t);const m={group:t,model:r,effect:l,config:e};this.portals.set(e.id,m),console.log("Portal con efecto agregado a la escena:",m),n(m)},s=>{console.log(`${s.loaded/s.total*100}% cargado`)},s=>{console.error("❌ Error al cargar el modelo:",s),console.error("Ruta del error:",e.modelPath),i(s),console.log("Creando marcador de respaldo..."),this.createFallbackPortal(e)})})}createFallbackPortal(e){const n=new D(2,2,.2),i=new v({color:65280,transparent:!0,opacity:.7}),s=new E(n,i);s.position.set(e.position.x,e.position.y||1,e.position.z),s.userData={id:e.id,name:e.name,description:e.description||"Portal de ejemplo",thumbnail:e.thumbnail||"https://via.placeholder.com/300",isPortal:!0},this.portals.set(e.id,s),this.scene.add(s),console.log(`Portal de respaldo creado para: ${e.id}`)}handleClick(e){if(!this.camera)return;this.raycaster.setFromCamera(new L(0,0),this.camera);const n=[];this.portals.forEach(s=>{(s.group||s).traverse(o=>{o.isMesh&&n.push(o)})});const i=this.raycaster.intersectObjects(n,!0);if(i.length>0){const s=i[0].object;s.userData.isPortal&&this.onPortalClick&&(this.onPortalClick(s.userData.portalData),this.controls&&this.controls.isLocked&&this.controls.unlock())}}getPortalById(e){return this.portals.get(e)}cleanup(){document.removeEventListener("click",this.handleClick,!1),this.portals.forEach(e=>{const n=e.group||e;this.scene.remove(n);const i=t=>{t&&(t.geometry&&t.geometry.dispose(),t.material&&(Array.isArray(t.material)?t.material.forEach(o=>o.dispose()):t.material.dispose()),t.children&&t.children.forEach(o=>i(o)))};i(n);const s=e.model&&e.model.userData.mixer||n.userData&&n.userData.mixer;if(s){const t=this.mixers.indexOf(s);t>-1&&this.mixers.splice(t,1)}}),this.portals.clear(),this.mixers=[]}}class ae{constructor(e=null){this.isOpen=!1,this.controls=e,this.createModal(),this.addEventListeners()}createModal(){this.modal=document.createElement("div"),this.modal.className="modal",this.modal.style.cssText=`
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
        `,this.circleContainer=document.createElement("div"),this.circleContainer.style.cssText=`
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
            pointer-events: none;
        `,this.circle=document.createElement("div"),this.circle.className="modal-circle",this.circle.style.cssText=`
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
        `;const e=document.createElement("style");e.textContent=`
            @keyframes pulse {
                0% { transform: scale(1); }
                50% { transform: scale(1.1); }
                100% { transform: scale(1); }
            }
        `,document.head.appendChild(e),this.content=document.createElement("div"),this.content.className="modal-content",this.content.style.cssText=`
            opacity: 0;
            transition: opacity 0.3s ease-in-out 0.3s;
            text-align: center;
            font-family: 'Gobold', ui-sans-serif;
            max-width: 80%;
        `,this.title=document.createElement("h2"),this.title.className="modal-title",this.title.style.cssText=`
            margin: 0 0 1rem 0;
            font-size: 2rem;
            font-family: 'Gobold', ui-sans-serif;
            letter-spacing: 2px;
        `,this.description=document.createElement("p"),this.description.className="modal-description",this.description.style.cssText=`
            margin: 0 0 1.5rem 0;
            line-height: 1.5;
        `,this.buttonsContainer=document.createElement("div"),this.buttonsContainer.style.cssText=`
            display: flex;
            gap: 1rem;
            margin-top: 1.5rem;
            justify-content: center;
        `,this.openButton=document.createElement("button"),this.openButton.className="modal-open",this.openButton.textContent="Open",this.openButton.style.cssText=`
            background:rgb(255, 255, 255);
            border: 1px solid white;
            color: black;
            padding: 0.5rem 1.5rem;
            font-size: 1rem;
            cursor: pointer;
            transition: all 0.3s ease;
            border-radius: 20px;
            outline: none;
            font-family: 'Gobold', ui-sans-serif;
        `,this.openButton.addEventListener("mouseover",()=>{this.openButton.style.background="rgb(255, 255, 255)",this.openButton.style.transform="scale(1.1)"}),this.openButton.addEventListener("mouseout",()=>{this.openButton.style.background="rgb(255, 255, 255)",this.openButton.style.transform="scale(1)"}),this.closeButton=document.createElement("button"),this.closeButton.className="modal-close",this.closeButton.textContent="Close",this.closeButton.style.cssText=`
            background: transparent;
            border: 1px solid white;
            color: white;
            padding: 0.5rem 1.5rem;
            font-size: 1rem;
            cursor: pointer;
            transition: all 0.3s ease;
            border-radius: 20px;
            outline: none;
            font-family: 'Gobold', ui-sans-serif;
        `,this.closeButton.addEventListener("mouseover",()=>{this.closeButton.style.background="white",this.closeButton.style.color="black",this.closeButton.style.transform="scale(1.05)"}),this.closeButton.addEventListener("mouseout",()=>{this.closeButton.style.background="transparent",this.closeButton.style.color="white",this.closeButton.style.transform="scale(1)"}),this.content.appendChild(this.title),this.content.appendChild(this.description),this.buttonsContainer.appendChild(this.openButton),this.buttonsContainer.appendChild(this.closeButton),this.content.appendChild(this.buttonsContainer),this.circle.appendChild(this.content),this.circleContainer.appendChild(this.circle),this.modal.appendChild(this.circleContainer),document.body.appendChild(this.modal)}addEventListeners(){this.closeButton.onclick=()=>this.hide(),this.modal.onclick=e=>{e.target===this.modal&&this.hide()},document.addEventListener("keydown",e=>{e.key==="Escape"&&this.isOpen&&this.hide()})}show(e){e&&(this.isOpen=!0,this.modal.style.display="flex",e.name&&(this.title.textContent=e.name),e.description&&(this.description.textContent=e.description),e.link?(this.openButton.style.display="inline-block",this.openButton.onclick=()=>{if(e.link.startsWith("http://")||e.link.startsWith("https://"))window.open(e.link,"_blank");else{const n=`/experiences/${e.link}`;window.open(n,"_blank")}this.hide()}):this.openButton.style.display="none",this.modal.offsetWidth,this.modal.style.opacity="1",setTimeout(()=>{const n=Math.min(window.innerWidth,window.innerHeight)*.8;this.circle.style.width=`${n}px`,this.circle.style.height=`${n}px`,setTimeout(()=>{this.content.style.opacity="1"},300)},10),document.body.style.cursor="auto",this.controls&&this.controls.unlock())}hide(){this.content.style.transition="opacity 0.3s ease-out",this.content.style.opacity="0",this.circle.style.transition="width 0.4s ease-out, height 0.4s ease-out",this.circle.style.width="0",this.circle.style.height="0",setTimeout(()=>{this.modal.style.transition="opacity 0.3s ease-out",this.modal.style.opacity="0"},50),setTimeout(()=>{this.modal.style.display="none",this.content.style.transition="",this.circle.style.transition="",this.modal.style.transition="",document.body.style.cursor="none",this.controls&&this.controls.lock(),this.cleanup()},400)}cleanup(){}}const re=[{id:"portal-1",name:"Clean Squared Place",modelPath:"/assets/models/PortalCube.glb",position:{x:-45,y:4,z:-45},rotation:{x:0,y:0,z:0},scale:1,sphereDiameter:3,description:"Ephemeral existences, molecular arrangements with wills that die and reveal essential elements for creation.",link:"clean-squaredplace/cleansquaredplace.html"},{id:"portal-2",name:"Nitrogenous Bases",modelPath:"/assets/models/NBasesPortal.glb",position:{x:0,y:10,z:-45},rotation:{x:0,y:Math.PI/4,z:0},scale:6,sphereDiameter:1,description:"In the depths of molecular existence, every experience whispers the primordial secrets of life.",link:"n-bases/nbases.html"},{id:"portal-3",name:"Game of Life",modelPath:"/assets/models/PortalSphere.glb",position:{x:45,y:4,z:-45},rotation:{x:0,y:Math.PI/4,z:0},scale:1,sphereDiameter:3,description:"In the perpetual dance of creation and destruction, each cell is a verse of the universal poem. Simple rules give rise to infinite complexities, reflecting the mystery of how life emerges from the void and returns to it.",link:"game-life/gameoflife.html"},{id:"portal-4",name:"AnothEarth",modelPath:"/assets/models/AnothEarth.glb",position:{x:-45,y:7,z:5},rotation:{x:0,y:Math.PI/4,z:0},scale:.02,sphereDiameter:230,description:"A distorted mirror of our own world, where reality intertwines with fantasy. What if Earth had a lost twin in the multiverse?",link:"anothearth/anothearth.html"},{id:"portal-5",name:"Maxkodia",modelPath:"/assets/models/MaxkodiaPlanet.glb",position:{x:45,y:8,z:5},rotation:{x:0,y:Math.PI/4,z:0},scale:.05,sphereDiameter:120,description:"Brought forth from the depths of the cosmos, where time bends upon itself and now trapped here, there exists a planet that holds the secrets of civilizations that never came to be.",link:"maxkodiaplanet/maxkodiaplanet.html"},{id:"portal-6",name:"Space Words",modelPath:"/assets/models/skybox.glb",position:{x:-45,y:4,z:45},rotation:{x:0,y:Math.PI/4,z:0},scale:2,description:"Can we capture the infinite within language?",link:"space-words/spacewords.html"},{id:"portal-7",name:"Gardhan Thinker",modelPath:"/assets/models/brain.glb",position:{x:0,y:8,z:45},rotation:{x:0,y:Math.PI,z:0},scale:5,sphereDiameter:1,description:"A labyrinth of thoughts where consciousness meets the pure essence of contemplation. A space where time stands still and only the act of thinking remains.",link:"thinker/thinker.html"},{id:"portal-8",name:"Deep Space",modelPath:"/assets/models/ship.glb",position:{x:45,y:4.5,z:45},rotation:{x:0,y:Math.PI/8,z:0},scale:.7,sphereDiameter:5,description:"In the depths of the cosmos, where time is but a memory and space an illusion, we come face to face with what we truly are: travelers of darkness seeking light in the abyss, where only nonexistence awaits us.",link:"deepspace/deepspace.html"}];let P=1;const le=.5,x=document.getElementById("container"),f=new F;f.background=new M(16777215);const w=new K(75,window.innerWidth/window.innerHeight,.1,1e3);w.name="camera";const ce=new U(100,100),de=new V({color:16777215,roughness:.8,metalness:0,transparent:!0,opacity:0}),z=new E(ce,de);z.rotation.x=-Math.PI/2;z.receiveShadow=!0;f.add(z);const he=100,me=50,pe=new M(0),ue=new M(0),b=new X(he,me,pe,ue);b.material.opacity=.5;b.material.transparent=!0;b.position.y=.01;f.add(b);const ye=new Z(16777215,.8);f.add(ye);const B=new J(16777215,.8);B.position.set(1,1,1);B.castShadow=!0;f.add(B);x||console.error('No se encontró el elemento con id "container"');const c=new Q({antialias:!0});c.setSize(window.innerWidth,window.innerHeight);c.shadowMap.enabled=!0;x.appendChild(c.domElement);const d=new Y(w,c.domElement);w.position.set(0,1.6,5);const C=d.getObject();C?(f.add(C),C.position.y=1.6):console.error("No se pudo obtener el objeto de la cámara de los controles");const u={};document.addEventListener("keydown",a=>{u[a.code]=!0,a.code==="KeyP"&&(d.isLocked?d.unlock():d.lock().catch(e=>{console.error("Error al bloquear el puntero:",e)}))},!1);document.addEventListener("keyup",a=>{u[a.code]=!1},!1);const fe=new ae(d),y=new ie(f,a=>{console.log("Portal clickeado:",a),fe.show(a)});y.setControls&&y.setCamera&&(y.setControls(d),y.setCamera(w));x&&x.addEventListener("click",a=>{y.handleClick&&y.handleClick(a)});y.loadPortals&&y.loadPortals(re);new q;new L(0,0);new $;const G=new R;function W(){requestAnimationFrame(W);const a=G.getDelta();P=.5+.5*Math.sin(G.elapsedTime*le),b.material.opacity=P*.5;const e=P*.8+.2;if(b.material.color.setRGB(e,e,e),d.isLocked){const i=5*Math.min(.1,a),s=(u.KeyD||u.ArrowRight?1:0)-(u.KeyA||u.ArrowLeft?1:0),t=(u.KeyW||u.ArrowUp?1:0)-(u.KeyS||u.ArrowDown?1:0);t!==0&&d.moveForward(t*i),s!==0&&d.moveRight(s*i);const o=50,r=d.getObject().position;r.x=T.clamp(r.x,-o,o),r.z=T.clamp(r.z,-o,o)}c.render(f,w)}function we(){if(!localStorage.getItem("hasSeenInstructions")){const a=document.createElement("div");a.id="instructions-modal",a.style.cssText=`
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 10000;
            background: rgba(0, 0, 0, 0.8);
            backdrop-filter: blur(5px);
        `;const e=document.createElement("iframe");e.src="instructions.html",e.style.cssText=`
            width: 100%;
            height: 100%;
            border: none;
            background: transparent;
        `,a.appendChild(e),document.body.appendChild(a);const n=()=>{document.body.removeChild(a),localStorage.setItem("hasSeenInstructions","true"),window.focus(),window.removeEventListener("message",i)},i=t=>{t.data==="closeInstructions"&&n()};window.addEventListener("message",i,!1);const s=t=>{t.key==="Escape"&&n()};document.addEventListener("keydown",s),a._cleanup=()=>{document.removeEventListener("keydown",s)}}}we();window.addEventListener("resize",()=>{w.aspect=window.innerWidth/window.innerHeight,w.updateProjectionMatrix(),c.setSize(window.innerWidth,window.innerHeight)});x&&x.addEventListener("click",()=>{if(!d){console.error("Los controles no están inicializados correctamente");return}d.isLocked===!1&&(c.domElement.requestPointerLock=c.domElement.requestPointerLock||c.domElement.mozRequestPointerLock||c.domElement.webkitRequestPointerLock,c.domElement.requestPointerLock&&c.domElement.requestPointerLock())});document.addEventListener("pointerlockchange",S,!1);document.addEventListener("mozpointerlockchange",S,!1);document.addEventListener("webkitpointerlockchange",S,!1);function S(){document.pointerLockElement===c.domElement||document.mozPointerLockElement===c.domElement||document.webkitPointerLockElement===c.domElement?d.isLocked=!0:d.isLocked=!1}W();console.log("Presiona P para alternar el control del ratón");console.log("Haz clic en la pantalla para habilitar los controles");ne(()=>import("https://portalsgarden.netlify.app/experiences/n-bases/nbases.js"),[]).then(a=>{}).catch(a=>{console.error("Error al cargar nbases.js:",a)});
