import{G,R as N,V as C,C as $,B as D,M as v,a as E,S as W,D as H,b as j,A as R,c as F,d as M,P as K,e as V,f as _,g as U,h as X,i as Z,W as J,j as Q,k as O}from"./vendor_three-CkZDgsSm.js";(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const t of document.querySelectorAll('link[rel="modulepreload"]'))i(t);new MutationObserver(t=>{for(const o of t)if(o.type==="childList")for(const n of o.addedNodes)n.tagName==="LINK"&&n.rel==="modulepreload"&&i(n)}).observe(document,{childList:!0,subtree:!0});function s(t){const o={};return t.integrity&&(o.integrity=t.integrity),t.referrerPolicy&&(o.referrerPolicy=t.referrerPolicy),t.crossOrigin==="use-credentials"?o.credentials="include":t.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function i(t){if(t.ep)return;t.ep=!0;const o=s(t);fetch(t.href,o)}})();function Y(a,{position:e="top-right",src:s="",color:i="#000000"}){const t=document.getElementById(a);if(!t){console.error("bgmusic.js: no se encontró el contenedor con id:",a);return}const o=new Audio(s);o.loop=!0,o.preload="auto";const n=document.createElement("button");n.innerHTML=T(i),n.style.position="absolute",n.style.background="transparent",n.style.border="none",n.style.cursor="pointer",n.style.padding="5px",n.style.width="50px",n.style.height="50px",n.style.zIndex="9999";const l={"top-left":{top:"30px",left:"30px"},"top-right":{top:"30px",right:"30px"},"bottom-left":{bottom:"30px",left:"30px"},"bottom-right":{bottom:"30px",right:"30px"}};Object.assign(n.style,l[e]),n.addEventListener("mouseenter",()=>{n.style.opacity="0.7"}),n.addEventListener("mouseleave",()=>{n.style.opacity="1"});let h=!1;n.addEventListener("click",()=>{h?(o.play().catch(()=>{}),n.innerHTML=T(i)):(o.pause(),n.innerHTML=ee(i)),h=!h});const f=()=>{o.play().catch(()=>{}),document.removeEventListener("click",f)};document.addEventListener("click",f),window.addEventListener("blur",()=>{o.paused||o.pause()}),window.addEventListener("focus",()=>{h||o.play().catch(()=>{})}),t.appendChild(n)}function T(a){return`
    <svg xmlns="http://www.w3.org/2000/svg" fill="${a}" viewBox="0 0 24 24">
      <path d="M4 9v6h4l5 5V4L8 9H4z"/>
    </svg>
  `}function ee(a){return`
    <svg xmlns="http://www.w3.org/2000/svg" fill="${a}" viewBox="0 0 24 24">
      <path d="M16.5 12l4.5 4.5-1.5 1.5L15 13.5l-4.5 4.5V6l4.5 4.5 4.5-4.5 1.5 1.5L16.5 12z"/>
    </svg>
  `}Y("music",{position:"top-right",color:"#000000",src:"/sounds/ambient.mp3"});class te{constructor(e,s){console.log("Inicializando PortalManager..."),this.scene=e,this.onPortalClick=s,this.portals=new Map,this.loader=new G,this.raycaster=new N,this.mouse=new C,this.controls=null,this.camera=null,this.mixers=[],this.clock=new $,this.loader.manager.onError=i=>{console.error("Error cargando recurso:",i)},this.handleClick=this.handleClick.bind(this),this.animate()}animate(){requestAnimationFrame(()=>this.animate());const e=this.clock.getDelta();for(const s of this.mixers)s.update(e);this.updateSphereEffects()}setControls(e){return this.controls=e,this}setCamera(e){return this.camera=e,this}async loadPortals(e){for(const s of e)console.log(`Cargando portal: ${s.id} desde ${s.modelPath}`),this.loadModel(s)}createMarker(e){const s=new D(1,1,1),i=new v({color:65280,wireframe:!0,transparent:!0,opacity:.8}),t=new E(s,i);return t.position.set(e.position.x,e.position.y,e.position.z),t.scale.set(.5,.5,.5),t.userData={isPortal:!0,portalData:e,isPlaceholder:!0},t}createSphereEffect(e){const s=e.sphereDiameter||1.5,i=new W(s,32,32),t=new v({color:0,transparent:!0,opacity:.3,side:H}),o=new E(i,t);return o.userData={isPortal:!0,portalData:e,isEffect:!0},o.userData.pulseSpeed=.7+Math.random()*.6,o.userData.scaleIntensity=.25,o.userData.baseOpacity=.35,o.userData.opacityIntensity=.75,o}updateSphereEffects(){const e=this.clock.getElapsedTime();this.portals.forEach(s=>{var t;const i=s.effect||((t=s.userData)!=null&&t.isEffect?s:null);if(i){const o=i.userData.pulseSpeed||.8,n=i.userData.scaleIntensity||.15,l=i.userData.baseOpacity||.25,h=i.userData.opacityIntensity||.15,x=1+(Math.sin(e*o)*.5+.5)*n,k=Math.sin(e*(o*.8)+1)*.5+.5,b=l+k*h;i.scale.setScalar(x),i.material.opacity=Math.min(1,Math.max(0,b))}})}loadModel(e){return console.log(`Cargando modelo: ${e.id} desde ${e.modelPath}`),new Promise((s,i)=>{this.loader.load(e.modelPath,t=>{var x,k,b;console.log(`✅ Modelo cargado: ${e.id}`);const o=new j;o.position.set(e.position.x,e.position.y,e.position.z),o.rotation.set(((x=e.rotation)==null?void 0:x.x)||0,((k=e.rotation)==null?void 0:k.y)||0,((b=e.rotation)==null?void 0:b.z)||0);const n=e.scale||1;o.scale.set(n,n,n);const l=t.scene;if(t.animations&&t.animations.length>0){console.log(`🔍 Se encontraron ${t.animations.length} animaciones`);const m=new R(l);this.mixers.push(m),t.animations.forEach(I=>{console.log(`▶️ Reproduciendo animación: ${I.name}`),m.clipAction(I).play()}),l.userData.mixer=m}else console.log("ℹ️ No se encontraron animaciones en el modelo");l.traverse(m=>{m.isMesh&&(m.castShadow=!0,m.receiveShadow=!0,m.userData={isPortal:!0,portalData:e})});const h=this.createSphereEffect(e);o.add(l),o.add(h),this.scene.add(o);const f={group:o,model:l,effect:h,config:e};this.portals.set(e.id,f),console.log("Portal con efecto agregado a la escena:",f),s(f)},t=>{console.log(`${t.loaded/t.total*100}% cargado`)},t=>{console.error("❌ Error al cargar el modelo:",t),console.error("Ruta del error:",e.modelPath),i(t),console.log("Creando marcador de respaldo..."),this.createFallbackPortal(e)})})}createFallbackPortal(e){const s=new D(2,2,.2),i=new v({color:65280,transparent:!0,opacity:.7}),t=new E(s,i);t.position.set(e.position.x,e.position.y||1,e.position.z),t.userData={id:e.id,name:e.name,description:e.description||"Portal de ejemplo",thumbnail:e.thumbnail||"https://via.placeholder.com/300",isPortal:!0},this.portals.set(e.id,t),this.scene.add(t),console.log(`Portal de respaldo creado para: ${e.id}`)}handleClick(e){if(!this.camera)return;this.raycaster.setFromCamera(new C(0,0),this.camera);const s=[];this.portals.forEach(t=>{(t.group||t).traverse(n=>{n.isMesh&&s.push(n)})});const i=this.raycaster.intersectObjects(s,!0);if(i.length>0){const t=i[0].object;t.userData.isPortal&&this.onPortalClick&&(this.onPortalClick(t.userData.portalData),this.controls&&this.controls.isLocked&&this.controls.unlock())}}getPortalById(e){return this.portals.get(e)}cleanup(){document.removeEventListener("click",this.handleClick,!1),this.portals.forEach(e=>{const s=e.group||e;this.scene.remove(s);const i=o=>{o&&(o.geometry&&o.geometry.dispose(),o.material&&(Array.isArray(o.material)?o.material.forEach(n=>n.dispose()):o.material.dispose()),o.children&&o.children.forEach(n=>i(n)))};i(s);const t=e.model&&e.model.userData.mixer||s.userData&&s.userData.mixer;if(t){const o=this.mixers.indexOf(t);o>-1&&this.mixers.splice(o,1)}}),this.portals.clear(),this.mixers=[]}}class oe{constructor(e=null){this.isOpen=!1,this.controls=e,this.createModal(),this.addEventListeners()}createModal(){this.modal=document.createElement("div"),this.modal.className="modal",this.modal.style.cssText=`
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
        `,this.closeButton.addEventListener("mouseover",()=>{this.closeButton.style.background="white",this.closeButton.style.color="black",this.closeButton.style.transform="scale(1.05)"}),this.closeButton.addEventListener("mouseout",()=>{this.closeButton.style.background="transparent",this.closeButton.style.color="white",this.closeButton.style.transform="scale(1)"}),this.content.appendChild(this.title),this.content.appendChild(this.description),this.buttonsContainer.appendChild(this.openButton),this.buttonsContainer.appendChild(this.closeButton),this.content.appendChild(this.buttonsContainer),this.circle.appendChild(this.content),this.circleContainer.appendChild(this.circle),this.modal.appendChild(this.circleContainer),document.body.appendChild(this.modal)}addEventListeners(){this.closeButton.onclick=()=>this.hide(),this.modal.onclick=e=>{e.target===this.modal&&this.hide()},document.addEventListener("keydown",e=>{e.key==="Escape"&&this.isOpen&&this.hide()})}show(e){e&&(this.isOpen=!0,this.modal.style.display="flex",e.name&&(this.title.textContent=e.name),e.description&&(this.description.textContent=e.description),e.link?(this.openButton.style.display="inline-block",this.openButton.onclick=()=>{if(e.link.startsWith("http://")||e.link.startsWith("https://"))window.open(e.link,"_blank");else{const s=`/experiences/${e.link}`;window.open(s,"_blank")}this.hide()}):this.openButton.style.display="none",this.modal.offsetWidth,this.modal.style.opacity="1",setTimeout(()=>{const s=Math.min(window.innerWidth,window.innerHeight)*.8;this.circle.style.width=`${s}px`,this.circle.style.height=`${s}px`,setTimeout(()=>{this.content.style.opacity="1"},300)},10),document.body.style.cursor="auto",this.controls&&this.controls.unlock())}hide(){this.content.style.transition="opacity 0.3s ease-out",this.content.style.opacity="0",this.circle.style.transition="width 0.4s ease-out, height 0.4s ease-out",this.circle.style.width="0",this.circle.style.height="0",setTimeout(()=>{this.modal.style.transition="opacity 0.3s ease-out",this.modal.style.opacity="0"},50),setTimeout(()=>{this.modal.style.display="none",this.content.style.transition="",this.circle.style.transition="",this.modal.style.transition="",document.body.style.cursor="none",this.controls&&this.controls.lock(),this.cleanup()},400)}cleanup(){}}const se=[{id:"portal-1",name:"Clean Squared Place",modelPath:"/assets/models/PortalCube.glb",position:{x:-45,y:4,z:-45},rotation:{x:0,y:0,z:0},scale:1,sphereDiameter:3,description:"Ephemeral existences, molecular arrangements with wills that die and reveal essential elements for creation.",link:"clean-squaredplace/cleansquaredplace.html"},{id:"portal-2",name:"Nitrogenous Bases",modelPath:"/assets/models/NBasesPortal.glb",position:{x:5,y:10,z:-45},rotation:{x:0,y:Math.PI/4,z:0},scale:6,sphereDiameter:1,description:"In the depths of molecular existence, every experience whispers the primordial secrets of life.",link:"n-bases/nbases.html"},{id:"portal-3",name:"Game of Life",modelPath:"/assets/models/PortalSphere.glb",position:{x:45,y:4,z:-45},rotation:{x:0,y:Math.PI/4,z:0},scale:1,sphereDiameter:3,description:"In the perpetual dance of creation and destruction, each cell is a verse of the universal poem. Simple rules give rise to infinite complexities, reflecting the mystery of how life emerges from the void and returns to it.",link:"game-life/gameoflife.html"},{id:"portal-4",name:"AnothEarth",modelPath:"/assets/models/AnothEarth.glb",position:{x:-45,y:7,z:5},rotation:{x:0,y:Math.PI/4,z:0},scale:.02,sphereDiameter:230,description:"A distorted mirror of our own world, where reality intertwines with fantasy. What if Earth had a lost twin in the multiverse?",link:"anothearth/anothearth.html"},{id:"portal-5",name:"Maxkodia",modelPath:"/assets/models/MaxkodiaPlanet.glb",position:{x:45,y:8,z:5},rotation:{x:0,y:Math.PI/4,z:0},scale:.05,sphereDiameter:120,description:"Brought forth from the depths of the cosmos, where time bends upon itself and now trapped here, there exists a planet that holds the secrets of civilizations that never came to be.",link:"maxkodiaplanet/maxkodiaplanet.html"},{id:"portal-6",name:"Space Words",modelPath:"/assets/models/skybox.glb",position:{x:-45,y:4,z:45},rotation:{x:0,y:Math.PI/4,z:0},scale:2,description:"Can we capture the infinite within language?",link:"space-words/spacewords.html"},{id:"portal-7",name:"Gardhan Thinker",modelPath:"/assets/models/brain.glb",position:{x:5,y:8,z:45},rotation:{x:0,y:Math.PI,z:0},scale:5,sphereDiameter:1,description:"A labyrinth of thoughts where consciousness meets the pure essence of contemplation. A space where time stands still and only the act of thinking remains.",link:"thinker/thinker.html"},{id:"portal-8",name:"Deep Space",modelPath:"/assets/models/ship.glb",position:{x:45,y:4.5,z:45},rotation:{x:0,y:Math.PI/8,z:0},scale:.7,sphereDiameter:5,description:"In the depths of the cosmos, where time is but a memory and space an illusion, we come face to face with what we truly are: travelers of darkness seeking light in the abyss, where only nonexistence awaits us.",link:"deepspace/deepspace.html"}];let P=1;const ne=.5,w=document.getElementById("container"),u=new F;u.background=new M(16777215);const y=new K(75,window.innerWidth/window.innerHeight,.1,1e3);y.name="camera";const ie=new V(100,100),ae=new _({color:16777215,roughness:.8,metalness:0,transparent:!0,opacity:0}),z=new E(ie,ae);z.rotation.x=-Math.PI/2;z.receiveShadow=!0;u.add(z);const re=100,le=50,ce=new M(0),de=new M(0),g=new U(re,le,ce,de);g.material.opacity=.5;g.material.transparent=!0;g.position.y=.01;u.add(g);const he=new X(16777215,.8);u.add(he);const B=new Z(16777215,.8);B.position.set(1,1,1);B.castShadow=!0;u.add(B);w||console.error('No se encontró el elemento con id "container"');const r=new J({antialias:!0});r.setSize(window.innerWidth,window.innerHeight);r.shadowMap.enabled=!0;w.appendChild(r.domElement);const c=new Q(y,r.domElement);y.position.set(0,1.6,5);const L=c.getObject();L?(u.add(L),L.position.y=1.6):console.error("No se pudo obtener el objeto de la cámara de los controles");const d={};document.addEventListener("keydown",a=>{d[a.code]=!0,a.code==="KeyP"&&(c.isLocked?c.unlock():c.lock().catch(e=>{console.error("Error al bloquear el puntero:",e)}))},!1);document.addEventListener("keyup",a=>{d[a.code]=!1},!1);const me=new oe(c),p=new te(u,a=>{console.log("Portal clickeado:",a),me.show(a)});p.setControls&&p.setCamera&&(p.setControls(c),p.setCamera(y));w&&w.addEventListener("click",a=>{p.handleClick&&p.handleClick(a)});p.loadPortals&&p.loadPortals(se);new N;new C(0,0);new G;const A=new $;function q(){requestAnimationFrame(q);const a=A.getDelta();P=.5+.5*Math.sin(A.elapsedTime*ne),g.material.opacity=P*.5;const e=P*.8+.2;if(g.material.color.setRGB(e,e,e),c.isLocked){const i=5*Math.min(.1,a),t=(d.KeyD||d.ArrowRight?1:0)-(d.KeyA||d.ArrowLeft?1:0),o=(d.KeyW||d.ArrowUp?1:0)-(d.KeyS||d.ArrowDown?1:0);o!==0&&c.moveForward(o*i),t!==0&&c.moveRight(t*i);const n=50,l=c.getObject().position;l.x=O.clamp(l.x,-n,n),l.z=O.clamp(l.z,-n,n)}r.render(u,y)}function pe(){if(!localStorage.getItem("hasSeenInstructions")){const a=document.createElement("div");a.id="instructions-modal",a.style.cssText=`
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
        `,a.appendChild(e),document.body.appendChild(a);const s=()=>{document.body.removeChild(a),localStorage.setItem("hasSeenInstructions","true"),window.focus(),window.removeEventListener("message",i)},i=o=>{o.data==="closeInstructions"&&s()};window.addEventListener("message",i,!1);const t=o=>{o.key==="Escape"&&s()};document.addEventListener("keydown",t),a._cleanup=()=>{document.removeEventListener("keydown",t)}}}pe();window.addEventListener("resize",()=>{y.aspect=window.innerWidth/window.innerHeight,y.updateProjectionMatrix(),r.setSize(window.innerWidth,window.innerHeight)});w&&w.addEventListener("click",()=>{if(!c){console.error("Los controles no están inicializados correctamente");return}c.isLocked===!1&&(r.domElement.requestPointerLock=r.domElement.requestPointerLock||r.domElement.mozRequestPointerLock||r.domElement.webkitRequestPointerLock,r.domElement.requestPointerLock&&r.domElement.requestPointerLock())});document.addEventListener("pointerlockchange",S,!1);document.addEventListener("mozpointerlockchange",S,!1);document.addEventListener("webkitpointerlockchange",S,!1);function S(){document.pointerLockElement===r.domElement||document.mozPointerLockElement===r.domElement||document.webkitPointerLockElement===r.domElement?c.isLocked=!0:c.isLocked=!1}q();console.log("Presiona P para alternar el control del ratón");console.log("Haz clic en la pantalla para habilitar los controles");
