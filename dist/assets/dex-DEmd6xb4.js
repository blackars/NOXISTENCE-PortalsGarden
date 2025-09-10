import{R as O,V as L,C as $,B as D,M as P,a as E,S as W,D as N,G as _,A as j,b as F,c as M,P as H,d as K,e as U,f as V,g as X,h as Z,W as J,i as T}from"./three.module-Do2X3ygC.js";import{c as Q}from"./bgmusic-D41st_RR.js";import{P as Y}from"./PointerLockControls-CS8I42zq.js";import{G as q}from"./GLTFLoader-BqwPtrNt.js";Q("music",{position:"top-right",color:"#000000",src:"/sounds/ambient.mp3"});const ee="modulepreload",te=function(a){return"/"+a},A={},oe=function(e,s,n){let t=Promise.resolve();if(s&&s.length>0){document.getElementsByTagName("link");const i=document.querySelector("meta[property=csp-nonce]"),r=(i==null?void 0:i.nonce)||(i==null?void 0:i.getAttribute("nonce"));t=Promise.allSettled(s.map(d=>{if(d=te(d),d in A)return;A[d]=!0;const u=d.endsWith(".css"),g=u?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${d}"]${g}`))return;const h=document.createElement("link");if(h.rel=u?"stylesheet":ee,u||(h.as="script"),h.crossOrigin="",h.href=d,r&&h.setAttribute("nonce",r),document.head.appendChild(h),u)return new Promise((k,m)=>{h.addEventListener("load",k),h.addEventListener("error",()=>m(new Error(`Unable to preload CSS for ${d}`)))})}))}function o(i){const r=new Event("vite:preloadError",{cancelable:!0});if(r.payload=i,window.dispatchEvent(r),!r.defaultPrevented)throw i}return t.then(i=>{for(const r of i||[])r.status==="rejected"&&o(r.reason);return e().catch(o)})};class se{constructor(e,s){console.log("Inicializando PortalManager..."),this.scene=e,this.onPortalClick=s,this.portals=new Map,this.loader=new q,this.raycaster=new O,this.mouse=new L,this.controls=null,this.camera=null,this.mixers=[],this.clock=new $,this.loader.manager.onError=n=>{console.error("Error cargando recurso:",n)},this.handleClick=this.handleClick.bind(this),this.animate()}animate(){requestAnimationFrame(()=>this.animate());const e=this.clock.getDelta();for(const s of this.mixers)s.update(e);this.updateSphereEffects()}setControls(e){return this.controls=e,this}setCamera(e){return this.camera=e,this}async loadPortals(e){for(const s of e)console.log(`Cargando portal: ${s.id} desde ${s.modelPath}`),this.loadModel(s)}createMarker(e){const s=new D(1,1,1),n=new P({color:65280,wireframe:!0,transparent:!0,opacity:.8}),t=new E(s,n);return t.position.set(e.position.x,e.position.y,e.position.z),t.scale.set(.5,.5,.5),t.userData={isPortal:!0,portalData:e,isPlaceholder:!0},t}createSphereEffect(e){const s=e.sphereDiameter||1.5,n=new W(s,32,32),t=new P({color:0,transparent:!0,opacity:.3,side:N}),o=new E(n,t);return o.userData={isPortal:!0,portalData:e,isEffect:!0},o.userData.pulseSpeed=.7+Math.random()*.6,o.userData.scaleIntensity=.25,o.userData.baseOpacity=.35,o.userData.opacityIntensity=.75,o}updateSphereEffects(){const e=this.clock.getElapsedTime();this.portals.forEach(s=>{var t;const n=s.effect||((t=s.userData)!=null&&t.isEffect?s:null);if(n){const o=n.userData.pulseSpeed||.8,i=n.userData.scaleIntensity||.15,r=n.userData.baseOpacity||.25,d=n.userData.opacityIntensity||.15,g=1+(Math.sin(e*o)*.5+.5)*i,h=Math.sin(e*(o*.8)+1)*.5+.5,k=r+h*d;n.scale.setScalar(g),n.material.opacity=Math.min(1,Math.max(0,k))}})}loadModel(e){return console.log(`Cargando modelo: ${e.id} desde ${e.modelPath}`),new Promise((s,n)=>{this.loader.load(e.modelPath,t=>{var g,h,k;console.log(`✅ Modelo cargado: ${e.id}`);const o=new _;o.position.set(e.position.x,e.position.y,e.position.z),o.rotation.set(((g=e.rotation)==null?void 0:g.x)||0,((h=e.rotation)==null?void 0:h.y)||0,((k=e.rotation)==null?void 0:k.z)||0);const i=e.scale||1;o.scale.set(i,i,i);const r=t.scene;if(t.animations&&t.animations.length>0){console.log(`🔍 Se encontraron ${t.animations.length} animaciones`);const m=new j(r);this.mixers.push(m),t.animations.forEach(I=>{console.log(`▶️ Reproduciendo animación: ${I.name}`),m.clipAction(I).play()}),r.userData.mixer=m}else console.log("ℹ️ No se encontraron animaciones en el modelo");r.traverse(m=>{m.isMesh&&(m.castShadow=!0,m.receiveShadow=!0,m.userData={isPortal:!0,portalData:e})});const d=this.createSphereEffect(e);o.add(r),o.add(d),this.scene.add(o);const u={group:o,model:r,effect:d,config:e};this.portals.set(e.id,u),console.log("Portal con efecto agregado a la escena:",u),s(u)},t=>{console.log(`${t.loaded/t.total*100}% cargado`)},t=>{console.error("❌ Error al cargar el modelo:",t),console.error("Ruta del error:",e.modelPath),n(t),console.log("Creando marcador de respaldo..."),this.createFallbackPortal(e)})})}createFallbackPortal(e){const s=new D(2,2,.2),n=new P({color:65280,transparent:!0,opacity:.7}),t=new E(s,n);t.position.set(e.position.x,e.position.y||1,e.position.z),t.userData={id:e.id,name:e.name,description:e.description||"Portal de ejemplo",thumbnail:e.thumbnail||"https://via.placeholder.com/300",isPortal:!0},this.portals.set(e.id,t),this.scene.add(t),console.log(`Portal de respaldo creado para: ${e.id}`)}handleClick(e){if(!this.camera)return;this.raycaster.setFromCamera(new L(0,0),this.camera);const s=[];this.portals.forEach(t=>{(t.group||t).traverse(i=>{i.isMesh&&s.push(i)})});const n=this.raycaster.intersectObjects(s,!0);if(n.length>0){const t=n[0].object;t.userData.isPortal&&this.onPortalClick&&(this.onPortalClick(t.userData.portalData),this.controls&&this.controls.isLocked&&this.controls.unlock())}}getPortalById(e){return this.portals.get(e)}cleanup(){document.removeEventListener("click",this.handleClick,!1),this.portals.forEach(e=>{const s=e.group||e;this.scene.remove(s);const n=o=>{o&&(o.geometry&&o.geometry.dispose(),o.material&&(Array.isArray(o.material)?o.material.forEach(i=>i.dispose()):o.material.dispose()),o.children&&o.children.forEach(i=>n(i)))};n(s);const t=e.model&&e.model.userData.mixer||s.userData&&s.userData.mixer;if(t){const o=this.mixers.indexOf(t);o>-1&&this.mixers.splice(o,1)}}),this.portals.clear(),this.mixers=[]}}class ne{constructor(e=null){this.isOpen=!1,this.controls=e,this.createModal(),this.addEventListeners()}createModal(){this.modal=document.createElement("div"),this.modal.className="modal",this.modal.style.cssText=`
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
        `,this.closeButton.addEventListener("mouseover",()=>{this.closeButton.style.background="white",this.closeButton.style.color="black",this.closeButton.style.transform="scale(1.05)"}),this.closeButton.addEventListener("mouseout",()=>{this.closeButton.style.background="transparent",this.closeButton.style.color="white",this.closeButton.style.transform="scale(1)"}),this.content.appendChild(this.title),this.content.appendChild(this.description),this.buttonsContainer.appendChild(this.openButton),this.buttonsContainer.appendChild(this.closeButton),this.content.appendChild(this.buttonsContainer),this.circle.appendChild(this.content),this.circleContainer.appendChild(this.circle),this.modal.appendChild(this.circleContainer),document.body.appendChild(this.modal)}addEventListeners(){this.closeButton.onclick=()=>this.hide(),this.modal.onclick=e=>{e.target===this.modal&&this.hide()},document.addEventListener("keydown",e=>{e.key==="Escape"&&this.isOpen&&this.hide()})}show(e){e&&(this.isOpen=!0,this.modal.style.display="flex",e.name&&(this.title.textContent=e.name),e.description&&(this.description.textContent=e.description),e.link?(this.openButton.style.display="inline-block",this.openButton.onclick=()=>{if(e.link.startsWith("http://")||e.link.startsWith("https://"))window.open(e.link,"_blank");else{const s=`/experiences/${e.link}`;window.open(s,"_blank")}this.hide()}):this.openButton.style.display="none",this.modal.offsetWidth,this.modal.style.opacity="1",setTimeout(()=>{const s=Math.min(window.innerWidth,window.innerHeight)*.8;this.circle.style.width=`${s}px`,this.circle.style.height=`${s}px`,setTimeout(()=>{this.content.style.opacity="1"},300)},10),document.body.style.cursor="auto",this.controls&&this.controls.unlock())}hide(){this.content.style.transition="opacity 0.3s ease-out",this.content.style.opacity="0",this.circle.style.transition="width 0.4s ease-out, height 0.4s ease-out",this.circle.style.width="0",this.circle.style.height="0",setTimeout(()=>{this.modal.style.transition="opacity 0.3s ease-out",this.modal.style.opacity="0"},50),setTimeout(()=>{this.modal.style.display="none",this.content.style.transition="",this.circle.style.transition="",this.modal.style.transition="",document.body.style.cursor="none",this.controls&&this.controls.lock(),this.cleanup()},400)}cleanup(){}}const ie=[{id:"portal-1",name:"Clean Squared Place",modelPath:"/assets/models/PortalCube.glb",position:{x:-45,y:4,z:-45},rotation:{x:0,y:0,z:0},scale:1,sphereDiameter:3,description:"Ephemeral existences, molecular arrangements with wills that die and reveal essential elements for creation.",link:"clean-squaredplace/cleansquaredplace.html"},{id:"portal-2",name:"Nitrogenous Bases",modelPath:"/assets/models/NBasesPortal.glb",position:{x:0,y:10,z:-45},rotation:{x:0,y:Math.PI/4,z:0},scale:6,sphereDiameter:1,description:"In the depths of molecular existence, every experience whispers the primordial secrets of life.",link:"n-bases/nbases.html"},{id:"portal-3",name:"Game of Life",modelPath:"/assets/models/PortalSphere.glb",position:{x:45,y:4,z:-45},rotation:{x:0,y:Math.PI/4,z:0},scale:1,sphereDiameter:3,description:"In the perpetual dance of creation and destruction, each cell is a verse of the universal poem. Simple rules give rise to infinite complexities, reflecting the mystery of how life emerges from the void and returns to it.",link:"game-life/gameoflife.html"},{id:"portal-4",name:"AnothEarth",modelPath:"/assets/models/AnothEarth.glb",position:{x:-45,y:7,z:5},rotation:{x:0,y:Math.PI/4,z:0},scale:.02,sphereDiameter:230,description:"A distorted mirror of our own world, where reality intertwines with fantasy. What if Earth had a lost twin in the multiverse?",link:"anothearth/anothearth.html"},{id:"portal-5",name:"Maxkodia",modelPath:"/assets/models/MaxkodiaPlanet.glb",position:{x:45,y:8,z:5},rotation:{x:0,y:Math.PI/4,z:0},scale:.05,sphereDiameter:120,description:"Brought forth from the depths of the cosmos, where time bends upon itself and now trapped here, there exists a planet that holds the secrets of civilizations that never came to be.",link:"maxkodiaplanet/maxkodiaplanet.html"},{id:"portal-6",name:"Space Words",modelPath:"/assets/models/skybox.glb",position:{x:-45,y:4,z:45},rotation:{x:0,y:Math.PI/4,z:0},scale:2,description:"Can we capture the infinite within language?",link:"space-words/spacewords.html"},{id:"portal-7",name:"Gardhan Thinker",modelPath:"/assets/models/brain.glb",position:{x:0,y:8,z:45},rotation:{x:0,y:Math.PI,z:0},scale:5,sphereDiameter:1,description:"A labyrinth of thoughts where consciousness meets the pure essence of contemplation. A space where time stands still and only the act of thinking remains.",link:"thinker/thinker.html"},{id:"portal-8",name:"Deep Space",modelPath:"/assets/models/ship.glb",position:{x:45,y:4.5,z:45},rotation:{x:0,y:Math.PI/8,z:0},scale:.7,sphereDiameter:5,description:"In the depths of the cosmos, where time is but a memory and space an illusion, we come face to face with what we truly are: travelers of darkness seeking light in the abyss, where only nonexistence awaits us.",link:"deepspace/deepspace.html"}];let v=1;const ae=.5,x=document.getElementById("container"),f=new F;f.background=new M(16777215);const w=new H(75,window.innerWidth/window.innerHeight,.1,1e3);w.name="camera";const re=new K(100,100),le=new U({color:16777215,roughness:.8,metalness:0,transparent:!0,opacity:0}),z=new E(re,le);z.rotation.x=-Math.PI/2;z.receiveShadow=!0;f.add(z);const ce=100,de=50,he=new M(0),me=new M(0),b=new V(ce,de,he,me);b.material.opacity=.5;b.material.transparent=!0;b.position.y=.01;f.add(b);const pe=new X(16777215,.8);f.add(pe);const S=new Z(16777215,.8);S.position.set(1,1,1);S.castShadow=!0;f.add(S);x||console.error('No se encontró el elemento con id "container"');const l=new J({antialias:!0});l.setSize(window.innerWidth,window.innerHeight);l.shadowMap.enabled=!0;x.appendChild(l.domElement);const c=new Y(w,l.domElement);w.position.set(0,1.6,5);const C=c.getObject();C?(f.add(C),C.position.y=1.6):console.error("No se pudo obtener el objeto de la cámara de los controles");const p={};document.addEventListener("keydown",a=>{p[a.code]=!0,a.code==="KeyP"&&(c.isLocked?c.unlock():c.lock().catch(e=>{console.error("Error al bloquear el puntero:",e)}))},!1);document.addEventListener("keyup",a=>{p[a.code]=!1},!1);const ue=new ne(c),y=new se(f,a=>{console.log("Portal clickeado:",a),ue.show(a)});y.setControls&&y.setCamera&&(y.setControls(c),y.setCamera(w));x&&x.addEventListener("click",a=>{y.handleClick&&y.handleClick(a)});y.loadPortals&&y.loadPortals(ie);new O;new L(0,0);new q;const G=new $;function R(){requestAnimationFrame(R);const a=G.getDelta();v=.5+.5*Math.sin(G.elapsedTime*ae),b.material.opacity=v*.5;const e=v*.8+.2;if(b.material.color.setRGB(e,e,e),c.isLocked){const n=5*Math.min(.1,a),t=(p.KeyD||p.ArrowRight?1:0)-(p.KeyA||p.ArrowLeft?1:0),o=(p.KeyW||p.ArrowUp?1:0)-(p.KeyS||p.ArrowDown?1:0);o!==0&&c.moveForward(o*n),t!==0&&c.moveRight(t*n);const i=50,r=c.getObject().position;r.x=T.clamp(r.x,-i,i),r.z=T.clamp(r.z,-i,i)}l.render(f,w)}function ye(){if(!localStorage.getItem("hasSeenInstructions")){const a=document.createElement("div");a.id="instructions-modal",a.style.cssText=`
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
        `,a.appendChild(e),document.body.appendChild(a);const s=()=>{document.body.removeChild(a),localStorage.setItem("hasSeenInstructions","true"),window.focus(),window.removeEventListener("message",n)},n=o=>{o.data==="closeInstructions"&&s()};window.addEventListener("message",n,!1);const t=o=>{o.key==="Escape"&&s()};document.addEventListener("keydown",t),a._cleanup=()=>{document.removeEventListener("keydown",t)}}}ye();window.addEventListener("resize",()=>{w.aspect=window.innerWidth/window.innerHeight,w.updateProjectionMatrix(),l.setSize(window.innerWidth,window.innerHeight)});x&&x.addEventListener("click",()=>{if(!c){console.error("Los controles no están inicializados correctamente");return}c.isLocked===!1&&(l.domElement.requestPointerLock=l.domElement.requestPointerLock||l.domElement.mozRequestPointerLock||l.domElement.webkitRequestPointerLock,l.domElement.requestPointerLock&&l.domElement.requestPointerLock())});document.addEventListener("pointerlockchange",B,!1);document.addEventListener("mozpointerlockchange",B,!1);document.addEventListener("webkitpointerlockchange",B,!1);function B(){document.pointerLockElement===l.domElement||document.mozPointerLockElement===l.domElement||document.webkitPointerLockElement===l.domElement?c.isLocked=!0:c.isLocked=!1}R();console.log("Presiona P para alternar el control del ratón");console.log("Haz clic en la pantalla para habilitar los controles");oe(()=>import("https://portalsgarden.netlify.app/experiences/n-bases/nbases.js"),[]).then(a=>{}).catch(a=>{console.error("Error al cargar nbases.js:",a)});
