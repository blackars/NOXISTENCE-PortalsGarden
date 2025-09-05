import{G as $,R as q,V as B,C as N,B as O,M as L,a as P,S as j,D as H,b as _,A as F,c as K,d as z,P as V,e as U,f as X,g as Z,h as J,i as Q,W as Y,j as ee,k as T}from"./vendor_three-CkZDgsSm.js";(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const t of document.querySelectorAll('link[rel="modulepreload"]'))i(t);new MutationObserver(t=>{for(const o of t)if(o.type==="childList")for(const s of o.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&i(s)}).observe(document,{childList:!0,subtree:!0});function n(t){const o={};return t.integrity&&(o.integrity=t.integrity),t.referrerPolicy&&(o.referrerPolicy=t.referrerPolicy),t.crossOrigin==="use-credentials"?o.credentials="include":t.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function i(t){if(t.ep)return;t.ep=!0;const o=n(t);fetch(t.href,o)}})();function te(r,{position:e="top-right",src:n="",color:i="#000000"}){const t=document.getElementById(r);if(!t){console.error("bgmusic.js: no se encontró el contenedor con id:",r);return}const o=new Audio(n);o.loop=!0,o.preload="auto";const s=document.createElement("button");s.innerHTML=A(i),s.style.position="absolute",s.style.background="transparent",s.style.border="none",s.style.cursor="pointer",s.style.padding="5px",s.style.width="50px",s.style.height="50px",s.style.zIndex="9999";const a={"top-left":{top:"30px",left:"30px"},"top-right":{top:"30px",right:"30px"},"bottom-left":{bottom:"30px",left:"30px"},"bottom-right":{bottom:"30px",right:"30px"}};Object.assign(s.style,a[e]),s.addEventListener("mouseenter",()=>{s.style.opacity="0.7"}),s.addEventListener("mouseleave",()=>{s.style.opacity="1"});let m=!1;s.addEventListener("click",()=>{m?(o.play().catch(()=>{}),s.innerHTML=A(i)):(o.pause(),s.innerHTML=oe(i)),m=!m});const l=()=>{o.play().catch(()=>{}),document.removeEventListener("click",l)};document.addEventListener("click",l),window.addEventListener("blur",()=>{o.paused||o.pause()}),window.addEventListener("focus",()=>{m||o.play().catch(()=>{})}),t.appendChild(s)}function A(r){return`
    <svg xmlns="http://www.w3.org/2000/svg" fill="${r}" viewBox="0 0 24 24">
      <path d="M4 9v6h4l5 5V4L8 9H4z"/>
    </svg>
  `}function oe(r){return`
    <svg xmlns="http://www.w3.org/2000/svg" fill="${r}" viewBox="0 0 24 24">
      <path d="M16.5 12l4.5 4.5-1.5 1.5L15 13.5l-4.5 4.5V6l4.5 4.5 4.5-4.5 1.5 1.5L16.5 12z"/>
    </svg>
  `}te("music",{position:"top-right",color:"#000000",src:"/sounds/ambient.mp3"});const se="modulepreload",ne=function(r,e){return new URL(r,e).href},G={},ie=function(e,n,i){let t=Promise.resolve();if(n&&n.length>0){const s=document.getElementsByTagName("link"),a=document.querySelector("meta[property=csp-nonce]"),m=(a==null?void 0:a.nonce)||(a==null?void 0:a.getAttribute("nonce"));t=Promise.allSettled(n.map(l=>{if(l=ne(l,i),l in G)return;G[l]=!0;const p=l.endsWith(".css"),k=p?'[rel="stylesheet"]':"";if(!!i)for(let f=s.length-1;f>=0;f--){const v=s[f];if(v.href===l&&(!p||v.rel==="stylesheet"))return}else if(document.querySelector(`link[href="${l}"]${k}`))return;const c=document.createElement("link");if(c.rel=p?"stylesheet":se,p||(c.as="script"),c.crossOrigin="",c.href=l,m&&c.setAttribute("nonce",m),document.head.appendChild(c),p)return new Promise((f,v)=>{c.addEventListener("load",f),c.addEventListener("error",()=>v(new Error(`Unable to preload CSS for ${l}`)))})}))}function o(s){const a=new Event("vite:preloadError",{cancelable:!0});if(a.payload=s,window.dispatchEvent(a),!a.defaultPrevented)throw s}return t.then(s=>{for(const a of s||[])a.status==="rejected"&&o(a.reason);return e().catch(o)})};class re{constructor(e,n){console.log("Inicializando PortalManager..."),this.scene=e,this.onPortalClick=n,this.portals=new Map,this.loader=new $,this.raycaster=new q,this.mouse=new B,this.controls=null,this.camera=null,this.mixers=[],this.clock=new N,this.loader.manager.onError=i=>{console.error("Error cargando recurso:",i)},this.handleClick=this.handleClick.bind(this),this.animate()}animate(){requestAnimationFrame(()=>this.animate());const e=this.clock.getDelta();for(const n of this.mixers)n.update(e);this.updateSphereEffects()}setControls(e){return this.controls=e,this}setCamera(e){return this.camera=e,this}async loadPortals(e){for(const n of e)console.log(`Cargando portal: ${n.id} desde ${n.modelPath}`),this.loadModel(n)}createMarker(e){const n=new O(1,1,1),i=new L({color:65280,wireframe:!0,transparent:!0,opacity:.8}),t=new P(n,i);return t.position.set(e.position.x,e.position.y,e.position.z),t.scale.set(.5,.5,.5),t.userData={isPortal:!0,portalData:e,isPlaceholder:!0},t}createSphereEffect(e){const n=e.sphereDiameter||1.5,i=new j(n,32,32),t=new L({color:0,transparent:!0,opacity:.3,side:H}),o=new P(i,t);return o.userData={isPortal:!0,portalData:e,isEffect:!0},o.userData.pulseSpeed=.7+Math.random()*.6,o.userData.scaleIntensity=.25,o.userData.baseOpacity=.35,o.userData.opacityIntensity=.75,o}updateSphereEffects(){const e=this.clock.getElapsedTime();this.portals.forEach(n=>{var t;const i=n.effect||((t=n.userData)!=null&&t.isEffect?n:null);if(i){const o=i.userData.pulseSpeed||.8,s=i.userData.scaleIntensity||.15,a=i.userData.baseOpacity||.25,m=i.userData.opacityIntensity||.15,p=1+(Math.sin(e*o)*.5+.5)*s,k=Math.sin(e*(o*.8)+1)*.5+.5,E=a+k*m;i.scale.setScalar(p),i.material.opacity=Math.min(1,Math.max(0,E))}})}loadModel(e){return console.log(`Cargando modelo: ${e.id} desde ${e.modelPath}`),new Promise((n,i)=>{this.loader.load(e.modelPath,t=>{var p,k,E;console.log(`✅ Modelo cargado: ${e.id}`);const o=new _;o.position.set(e.position.x,e.position.y,e.position.z),o.rotation.set(((p=e.rotation)==null?void 0:p.x)||0,((k=e.rotation)==null?void 0:k.y)||0,((E=e.rotation)==null?void 0:E.z)||0);const s=e.scale||1;o.scale.set(s,s,s);const a=t.scene;if(t.animations&&t.animations.length>0){console.log(`🔍 Se encontraron ${t.animations.length} animaciones`);const c=new F(a);this.mixers.push(c),t.animations.forEach(f=>{console.log(`▶️ Reproduciendo animación: ${f.name}`),c.clipAction(f).play()}),a.userData.mixer=c}else console.log("ℹ️ No se encontraron animaciones en el modelo");a.traverse(c=>{c.isMesh&&(c.castShadow=!0,c.receiveShadow=!0,c.userData={isPortal:!0,portalData:e})});const m=this.createSphereEffect(e);o.add(a),o.add(m),this.scene.add(o);const l={group:o,model:a,effect:m,config:e};this.portals.set(e.id,l),console.log("Portal con efecto agregado a la escena:",l),n(l)},t=>{console.log(`${t.loaded/t.total*100}% cargado`)},t=>{console.error("❌ Error al cargar el modelo:",t),console.error("Ruta del error:",e.modelPath),i(t),console.log("Creando marcador de respaldo..."),this.createFallbackPortal(e)})})}createFallbackPortal(e){const n=new O(2,2,.2),i=new L({color:65280,transparent:!0,opacity:.7}),t=new P(n,i);t.position.set(e.position.x,e.position.y||1,e.position.z),t.userData={id:e.id,name:e.name,description:e.description||"Portal de ejemplo",thumbnail:e.thumbnail||"https://via.placeholder.com/300",isPortal:!0},this.portals.set(e.id,t),this.scene.add(t),console.log(`Portal de respaldo creado para: ${e.id}`)}handleClick(e){if(!this.camera)return;this.raycaster.setFromCamera(new B(0,0),this.camera);const n=[];this.portals.forEach(t=>{(t.group||t).traverse(s=>{s.isMesh&&n.push(s)})});const i=this.raycaster.intersectObjects(n,!0);if(i.length>0){const t=i[0].object;t.userData.isPortal&&this.onPortalClick&&(this.onPortalClick(t.userData.portalData),this.controls&&this.controls.isLocked&&this.controls.unlock())}}getPortalById(e){return this.portals.get(e)}cleanup(){document.removeEventListener("click",this.handleClick,!1),this.portals.forEach(e=>{const n=e.group||e;this.scene.remove(n);const i=o=>{o&&(o.geometry&&o.geometry.dispose(),o.material&&(Array.isArray(o.material)?o.material.forEach(s=>s.dispose()):o.material.dispose()),o.children&&o.children.forEach(s=>i(s)))};i(n);const t=e.model&&e.model.userData.mixer||n.userData&&n.userData.mixer;if(t){const o=this.mixers.indexOf(t);o>-1&&this.mixers.splice(o,1)}}),this.portals.clear(),this.mixers=[]}}class ae{constructor(e=null){this.isOpen=!1,this.controls=e,this.createModal(),this.addEventListeners()}createModal(){this.modal=document.createElement("div"),this.modal.className="modal",this.modal.style.cssText=`
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
        `,this.closeButton.addEventListener("mouseover",()=>{this.closeButton.style.background="white",this.closeButton.style.color="black",this.closeButton.style.transform="scale(1.05)"}),this.closeButton.addEventListener("mouseout",()=>{this.closeButton.style.background="transparent",this.closeButton.style.color="white",this.closeButton.style.transform="scale(1)"}),this.content.appendChild(this.title),this.content.appendChild(this.description),this.buttonsContainer.appendChild(this.openButton),this.buttonsContainer.appendChild(this.closeButton),this.content.appendChild(this.buttonsContainer),this.circle.appendChild(this.content),this.circleContainer.appendChild(this.circle),this.modal.appendChild(this.circleContainer),document.body.appendChild(this.modal)}addEventListeners(){this.closeButton.onclick=()=>this.hide(),this.modal.onclick=e=>{e.target===this.modal&&this.hide()},document.addEventListener("keydown",e=>{e.key==="Escape"&&this.isOpen&&this.hide()})}show(e){e&&(this.isOpen=!0,this.modal.style.display="flex",e.name&&(this.title.textContent=e.name),e.description&&(this.description.textContent=e.description),e.link?(this.openButton.style.display="inline-block",this.openButton.onclick=()=>{if(e.link.startsWith("http://")||e.link.startsWith("https://"))window.open(e.link,"_blank");else{const n=`/experiences/${e.link}`;window.open(n,"_blank")}this.hide()}):this.openButton.style.display="none",this.modal.offsetWidth,this.modal.style.opacity="1",setTimeout(()=>{const n=Math.min(window.innerWidth,window.innerHeight)*.8;this.circle.style.width=`${n}px`,this.circle.style.height=`${n}px`,setTimeout(()=>{this.content.style.opacity="1"},300)},10),document.body.style.cursor="auto",this.controls&&this.controls.unlock())}hide(){this.content.style.transition="opacity 0.3s ease-out",this.content.style.opacity="0",this.circle.style.transition="width 0.4s ease-out, height 0.4s ease-out",this.circle.style.width="0",this.circle.style.height="0",setTimeout(()=>{this.modal.style.transition="opacity 0.3s ease-out",this.modal.style.opacity="0"},50),setTimeout(()=>{this.modal.style.display="none",this.content.style.transition="",this.circle.style.transition="",this.modal.style.transition="",document.body.style.cursor="none",this.controls&&this.controls.lock(),this.cleanup()},400)}cleanup(){}}const le=[{id:"portal-1",name:"Clean Squared Place",modelPath:"/assets/models/PortalCube.glb",position:{x:-45,y:4,z:-45},rotation:{x:0,y:0,z:0},scale:1,sphereDiameter:3,description:"Ephemeral existences, molecular arrangements with wills that die and reveal essential elements for creation.",link:"clean-squaredplace/cleansquaredplace.html"},{id:"portal-2",name:"Nitrogenous Bases",modelPath:"/assets/models/NBasesPortal.glb",position:{x:0,y:10,z:-45},rotation:{x:0,y:Math.PI/4,z:0},scale:6,sphereDiameter:1,description:"In the depths of molecular existence, every experience whispers the primordial secrets of life.",link:"n-bases/nbases.html"},{id:"portal-3",name:"Game of Life",modelPath:"/assets/models/PortalSphere.glb",position:{x:45,y:4,z:-45},rotation:{x:0,y:Math.PI/4,z:0},scale:1,sphereDiameter:3,description:"In the perpetual dance of creation and destruction, each cell is a verse of the universal poem. Simple rules give rise to infinite complexities, reflecting the mystery of how life emerges from the void and returns to it.",link:"game-life/gameoflife.html"},{id:"portal-4",name:"AnothEarth",modelPath:"/assets/models/AnothEarth.glb",position:{x:-45,y:7,z:5},rotation:{x:0,y:Math.PI/4,z:0},scale:.02,sphereDiameter:230,description:"A distorted mirror of our own world, where reality intertwines with fantasy. What if Earth had a lost twin in the multiverse?",link:"anothearth/anothearth.html"},{id:"portal-5",name:"Maxkodia",modelPath:"/assets/models/MaxkodiaPlanet.glb",position:{x:45,y:8,z:5},rotation:{x:0,y:Math.PI/4,z:0},scale:.05,sphereDiameter:120,description:"Brought forth from the depths of the cosmos, where time bends upon itself and now trapped here, there exists a planet that holds the secrets of civilizations that never came to be.",link:"maxkodiaplanet/maxkodiaplanet.html"},{id:"portal-6",name:"Space Words",modelPath:"/assets/models/skybox.glb",position:{x:-45,y:4,z:45},rotation:{x:0,y:Math.PI/4,z:0},scale:2,description:"Can we capture the infinite within language?",link:"space-words/spacewords.html"},{id:"portal-7",name:"Gardhan Thinker",modelPath:"/assets/models/brain.glb",position:{x:5,y:8,z:45},rotation:{x:0,y:Math.PI,z:0},scale:5,sphereDiameter:1,description:"A labyrinth of thoughts where consciousness meets the pure essence of contemplation. A space where time stands still and only the act of thinking remains.",link:"thinker/thinker.html"},{id:"portal-8",name:"Deep Space",modelPath:"/assets/models/ship.glb",position:{x:45,y:4.5,z:45},rotation:{x:0,y:Math.PI/8,z:0},scale:.7,sphereDiameter:5,description:"In the depths of the cosmos, where time is but a memory and space an illusion, we come face to face with what we truly are: travelers of darkness seeking light in the abyss, where only nonexistence awaits us.",link:"deepspace/deepspace.html"}];let C=1;const ce=.5,x=document.getElementById("container"),w=new K;w.background=new z(16777215);const g=new V(75,window.innerWidth/window.innerHeight,.1,1e3);g.name="camera";const de=new U(100,100),he=new X({color:16777215,roughness:.8,metalness:0,transparent:!0,opacity:0}),S=new P(de,he);S.rotation.x=-Math.PI/2;S.receiveShadow=!0;w.add(S);const me=100,pe=50,ue=new z(0),fe=new z(0),b=new Z(me,pe,ue,fe);b.material.opacity=.5;b.material.transparent=!0;b.position.y=.01;w.add(b);const ye=new J(16777215,.8);w.add(ye);const I=new Q(16777215,.8);I.position.set(1,1,1);I.castShadow=!0;w.add(I);x||console.error('No se encontró el elemento con id "container"');const d=new Y({antialias:!0});d.setSize(window.innerWidth,window.innerHeight);d.shadowMap.enabled=!0;x.appendChild(d.domElement);const h=new ee(g,d.domElement);g.position.set(0,1.6,5);const M=h.getObject();M?(w.add(M),M.position.y=1.6):console.error("No se pudo obtener el objeto de la cámara de los controles");const u={};document.addEventListener("keydown",r=>{u[r.code]=!0,r.code==="KeyP"&&(h.isLocked?h.unlock():h.lock().catch(e=>{console.error("Error al bloquear el puntero:",e)}))},!1);document.addEventListener("keyup",r=>{u[r.code]=!1},!1);const we=new ae(h),y=new re(w,r=>{console.log("Portal clickeado:",r),we.show(r)});y.setControls&&y.setCamera&&(y.setControls(h),y.setCamera(g));x&&x.addEventListener("click",r=>{y.handleClick&&y.handleClick(r)});y.loadPortals&&y.loadPortals(le);new q;new B(0,0);new $;const R=new N;function W(){requestAnimationFrame(W);const r=R.getDelta();C=.5+.5*Math.sin(R.elapsedTime*ce),b.material.opacity=C*.5;const e=C*.8+.2;if(b.material.color.setRGB(e,e,e),h.isLocked){const i=5*Math.min(.1,r),t=(u.KeyD||u.ArrowRight?1:0)-(u.KeyA||u.ArrowLeft?1:0),o=(u.KeyW||u.ArrowUp?1:0)-(u.KeyS||u.ArrowDown?1:0);o!==0&&h.moveForward(o*i),t!==0&&h.moveRight(t*i);const s=50,a=h.getObject().position;a.x=T.clamp(a.x,-s,s),a.z=T.clamp(a.z,-s,s)}d.render(w,g)}function ge(){if(!localStorage.getItem("hasSeenInstructions")){const r=document.createElement("div");r.id="instructions-modal",r.style.cssText=`
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
        `,r.appendChild(e),document.body.appendChild(r);const n=()=>{document.body.removeChild(r),localStorage.setItem("hasSeenInstructions","true"),window.focus(),window.removeEventListener("message",i)},i=o=>{o.data==="closeInstructions"&&n()};window.addEventListener("message",i,!1);const t=o=>{o.key==="Escape"&&n()};document.addEventListener("keydown",t),r._cleanup=()=>{document.removeEventListener("keydown",t)}}}ge();window.addEventListener("resize",()=>{g.aspect=window.innerWidth/window.innerHeight,g.updateProjectionMatrix(),d.setSize(window.innerWidth,window.innerHeight)});x&&x.addEventListener("click",()=>{if(!h){console.error("Los controles no están inicializados correctamente");return}h.isLocked===!1&&(d.domElement.requestPointerLock=d.domElement.requestPointerLock||d.domElement.mozRequestPointerLock||d.domElement.webkitRequestPointerLock,d.domElement.requestPointerLock&&d.domElement.requestPointerLock())});document.addEventListener("pointerlockchange",D,!1);document.addEventListener("mozpointerlockchange",D,!1);document.addEventListener("webkitpointerlockchange",D,!1);function D(){document.pointerLockElement===d.domElement||document.mozPointerLockElement===d.domElement||document.webkitPointerLockElement===d.domElement?h.isLocked=!0:h.isLocked=!1}W();console.log("Presiona P para alternar el control del ratón");console.log("Haz clic en la pantalla para habilitar los controles");ie(()=>import("https://portalsgarden.netlify.app/experiences/n-bases/nbases.js"),[],import.meta.url).then(r=>{}).catch(r=>{console.error("Error al cargar nbases.js:",r)});
