import{c as q,R as G,V as L,C as O,B as D,M as P,a as E,S as $,D as R,G as j,A as F,b as H,d as M,P as K,e as _,f as U,g as V,h as X,i as Z,W as J,j as T}from"./three.module-BJNaBXBE.js";import{P as Q}from"./PointerLockControls-r5HpxkX-.js";import{G as N}from"./GLTFLoader-BBvRGZXy.js";q("music",{position:"top-right",color:"#000000",src:"/sounds/ambient.mp3"});class Y{constructor(e,s){console.log("Inicializando PortalManager..."),this.scene=e,this.onPortalClick=s,this.portals=new Map,this.loader=new N,this.raycaster=new G,this.mouse=new L,this.controls=null,this.camera=null,this.mixers=[],this.clock=new O,this.loader.manager.onError=n=>{console.error("Error cargando recurso:",n)},this.handleClick=this.handleClick.bind(this),this.animate()}animate(){requestAnimationFrame(()=>this.animate());const e=this.clock.getDelta();for(const s of this.mixers)s.update(e);this.updateSphereEffects()}setControls(e){return this.controls=e,this}setCamera(e){return this.camera=e,this}async loadPortals(e){for(const s of e)console.log(`Cargando portal: ${s.id} desde ${s.modelPath}`),this.loadModel(s)}createMarker(e){const s=new D(1,1,1),n=new P({color:65280,wireframe:!0,transparent:!0,opacity:.8}),t=new E(s,n);return t.position.set(e.position.x,e.position.y,e.position.z),t.scale.set(.5,.5,.5),t.userData={isPortal:!0,portalData:e,isPlaceholder:!0},t}createSphereEffect(e){const s=e.sphereDiameter||1.5,n=new $(s,32,32),t=new P({color:0,transparent:!0,opacity:.3,side:R}),o=new E(n,t);return o.userData={isPortal:!0,portalData:e,isEffect:!0},o.userData.pulseSpeed=.7+Math.random()*.6,o.userData.scaleIntensity=.25,o.userData.baseOpacity=.35,o.userData.opacityIntensity=.75,o}updateSphereEffects(){const e=this.clock.getElapsedTime();this.portals.forEach(s=>{var t;const n=s.effect||((t=s.userData)!=null&&t.isEffect?s:null);if(n){const o=n.userData.pulseSpeed||.8,a=n.userData.scaleIntensity||.15,c=n.userData.baseOpacity||.25,w=n.userData.opacityIntensity||.15,k=1+(Math.sin(e*o)*.5+.5)*a,x=Math.sin(e*(o*.8)+1)*.5+.5,b=c+x*w;n.scale.setScalar(k),n.material.opacity=Math.min(1,Math.max(0,b))}})}loadModel(e){return console.log(`Cargando modelo: ${e.id} desde ${e.modelPath}`),new Promise((s,n)=>{this.loader.load(e.modelPath,t=>{var k,x,b;console.log(`✅ Modelo cargado: ${e.id}`);const o=new j;o.position.set(e.position.x,e.position.y,e.position.z),o.rotation.set(((k=e.rotation)==null?void 0:k.x)||0,((x=e.rotation)==null?void 0:x.y)||0,((b=e.rotation)==null?void 0:b.z)||0);const a=e.scale||1;o.scale.set(a,a,a);const c=t.scene;if(t.animations&&t.animations.length>0){console.log(`🔍 Se encontraron ${t.animations.length} animaciones`);const h=new F(c);this.mixers.push(h),t.animations.forEach(I=>{console.log(`▶️ Reproduciendo animación: ${I.name}`),h.clipAction(I).play()}),c.userData.mixer=h}else console.log("ℹ️ No se encontraron animaciones en el modelo");c.traverse(h=>{h.isMesh&&(h.castShadow=!0,h.receiveShadow=!0,h.userData={isPortal:!0,portalData:e})});const w=this.createSphereEffect(e);o.add(c),o.add(w),this.scene.add(o);const g={group:o,model:c,effect:w,config:e};this.portals.set(e.id,g),console.log("Portal con efecto agregado a la escena:",g),s(g)},t=>{console.log(`${t.loaded/t.total*100}% cargado`)},t=>{console.error("❌ Error al cargar el modelo:",t),console.error("Ruta del error:",e.modelPath),n(t),console.log("Creando marcador de respaldo..."),this.createFallbackPortal(e)})})}createFallbackPortal(e){const s=new D(2,2,.2),n=new P({color:65280,transparent:!0,opacity:.7}),t=new E(s,n);t.position.set(e.position.x,e.position.y||1,e.position.z),t.userData={id:e.id,name:e.name,description:e.description||"Portal de ejemplo",thumbnail:e.thumbnail||"https://via.placeholder.com/300",isPortal:!0},this.portals.set(e.id,t),this.scene.add(t),console.log(`Portal de respaldo creado para: ${e.id}`)}handleClick(e){if(!this.camera)return;this.raycaster.setFromCamera(new L(0,0),this.camera);const s=[];this.portals.forEach(t=>{(t.group||t).traverse(a=>{a.isMesh&&s.push(a)})});const n=this.raycaster.intersectObjects(s,!0);if(n.length>0){const t=n[0].object;t.userData.isPortal&&this.onPortalClick&&(this.onPortalClick(t.userData.portalData),this.controls&&this.controls.isLocked&&this.controls.unlock())}}getPortalById(e){return this.portals.get(e)}cleanup(){document.removeEventListener("click",this.handleClick,!1),this.portals.forEach(e=>{const s=e.group||e;this.scene.remove(s);const n=o=>{o&&(o.geometry&&o.geometry.dispose(),o.material&&(Array.isArray(o.material)?o.material.forEach(a=>a.dispose()):o.material.dispose()),o.children&&o.children.forEach(a=>n(a)))};n(s);const t=e.model&&e.model.userData.mixer||s.userData&&s.userData.mixer;if(t){const o=this.mixers.indexOf(t);o>-1&&this.mixers.splice(o,1)}}),this.portals.clear(),this.mixers=[]}}class ee{constructor(e=null){this.isOpen=!1,this.controls=e,this.createModal(),this.addEventListeners()}createModal(){this.modal=document.createElement("div"),this.modal.className="modal",this.modal.style.cssText=`
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
        `,this.closeButton.addEventListener("mouseover",()=>{this.closeButton.style.background="white",this.closeButton.style.color="black",this.closeButton.style.transform="scale(1.05)"}),this.closeButton.addEventListener("mouseout",()=>{this.closeButton.style.background="transparent",this.closeButton.style.color="white",this.closeButton.style.transform="scale(1)"}),this.content.appendChild(this.title),this.content.appendChild(this.description),this.buttonsContainer.appendChild(this.openButton),this.buttonsContainer.appendChild(this.closeButton),this.content.appendChild(this.buttonsContainer),this.circle.appendChild(this.content),this.circleContainer.appendChild(this.circle),this.modal.appendChild(this.circleContainer),document.body.appendChild(this.modal)}addEventListeners(){this.closeButton.onclick=()=>this.hide(),this.modal.onclick=e=>{e.target===this.modal&&this.hide()},document.addEventListener("keydown",e=>{e.key==="Escape"&&this.isOpen&&this.hide()})}show(e){e&&(this.isOpen=!0,this.modal.style.display="flex",e.name&&(this.title.textContent=e.name),e.description&&(this.description.textContent=e.description),e.link?(this.openButton.style.display="inline-block",this.openButton.onclick=()=>{if(e.link.startsWith("http://")||e.link.startsWith("https://"))window.open(e.link,"_blank");else{const s=`/experiences/${e.link}`;window.open(s,"_blank")}this.hide()}):this.openButton.style.display="none",this.modal.offsetWidth,this.modal.style.opacity="1",setTimeout(()=>{const s=Math.min(window.innerWidth,window.innerHeight)*.8;this.circle.style.width=`${s}px`,this.circle.style.height=`${s}px`,setTimeout(()=>{this.content.style.opacity="1"},300)},10),document.body.style.cursor="auto",this.controls&&this.controls.unlock())}hide(){this.content.style.transition="opacity 0.3s ease-out",this.content.style.opacity="0",this.circle.style.transition="width 0.4s ease-out, height 0.4s ease-out",this.circle.style.width="0",this.circle.style.height="0",setTimeout(()=>{this.modal.style.transition="opacity 0.3s ease-out",this.modal.style.opacity="0"},50),setTimeout(()=>{this.modal.style.display="none",this.content.style.transition="",this.circle.style.transition="",this.modal.style.transition="",document.body.style.cursor="none",this.controls&&this.controls.lock(),this.cleanup()},400)}cleanup(){}}const te=[{id:"portal-1",name:"Clean Squared Place",modelPath:"/assets/models/PortalCube.glb",position:{x:-45,y:4,z:-45},rotation:{x:0,y:0,z:0},scale:1,sphereDiameter:3,description:"Ephemeral existences, molecular arrangements with wills that die and reveal essential elements for creation.",link:"clean-squaredplace/cleansquaredplace.html"},{id:"portal-2",name:"Nitrogenous Bases",modelPath:"/assets/models/NBasesPortal.glb",position:{x:5,y:10,z:-45},rotation:{x:0,y:Math.PI/4,z:0},scale:6,sphereDiameter:1,description:"In the depths of molecular existence, every experience whispers the primordial secrets of life.",link:"n-bases/nbases.html"},{id:"portal-3",name:"Game of Life",modelPath:"/assets/models/PortalSphere.glb",position:{x:45,y:4,z:-45},rotation:{x:0,y:Math.PI/4,z:0},scale:1,sphereDiameter:3,description:"In the perpetual dance of creation and destruction, each cell is a verse of the universal poem. Simple rules give rise to infinite complexities, reflecting the mystery of how life emerges from the void and returns to it.",link:"game-life/gameoflife.html"},{id:"portal-4",name:"AnothEarth",modelPath:"/assets/models/AnothEarth.glb",position:{x:-45,y:7,z:5},rotation:{x:0,y:Math.PI/4,z:0},scale:.02,sphereDiameter:230,description:"A distorted mirror of our own world, where reality intertwines with fantasy. What if Earth had a lost twin in the multiverse?",link:"anothearth/anothearth.html"},{id:"portal-5",name:"Maxkodia",modelPath:"/assets/models/MaxkodiaPlanet.glb",position:{x:45,y:8,z:5},rotation:{x:0,y:Math.PI/4,z:0},scale:.05,sphereDiameter:120,description:"Brought forth from the depths of the cosmos, where time bends upon itself and now trapped here, there exists a planet that holds the secrets of civilizations that never came to be.",link:"maxkodiaplanet/maxkodiaplanet.html"},{id:"portal-6",name:"Space Words",modelPath:"/assets/models/skybox.glb",position:{x:-45,y:4,z:45},rotation:{x:0,y:Math.PI/4,z:0},scale:2,description:"Can we capture the infinite within language?",link:"space-words/spacewords.html"},{id:"portal-7",name:"Gardhan Thinker",modelPath:"/assets/models/brain.glb",position:{x:5,y:8,z:45},rotation:{x:0,y:Math.PI,z:0},scale:5,sphereDiameter:1,description:"A labyrinth of thoughts where consciousness meets the pure essence of contemplation. A space where time stands still and only the act of thinking remains.",link:"thinker/thinker.html"},{id:"portal-8",name:"Deep Space",modelPath:"/assets/models/ship.glb",position:{x:45,y:4.5,z:45},rotation:{x:0,y:Math.PI/8,z:0},scale:.7,sphereDiameter:5,description:"In the depths of the cosmos, where time is but a memory and space an illusion, we come face to face with what we truly are: travelers of darkness seeking light in the abyss, where only nonexistence awaits us.",link:"deepspace/deepspace.html"}];let v=1;const oe=.5,f=document.getElementById("container"),p=new H;p.background=new M(16777215);const u=new K(75,window.innerWidth/window.innerHeight,.1,1e3);u.name="camera";const se=new _(100,100),ne=new U({color:16777215,roughness:.8,metalness:0,transparent:!0,opacity:0}),z=new E(se,ne);z.rotation.x=-Math.PI/2;z.receiveShadow=!0;p.add(z);const ie=100,ae=50,re=new M(0),le=new M(0),y=new V(ie,ae,re,le);y.material.opacity=.5;y.material.transparent=!0;y.position.y=.01;p.add(y);const ce=new X(16777215,.8);p.add(ce);const B=new Z(16777215,.8);B.position.set(1,1,1);B.castShadow=!0;p.add(B);f||console.error('No se encontró el elemento con id "container"');const r=new J({antialias:!0});r.setSize(window.innerWidth,window.innerHeight);r.shadowMap.enabled=!0;f.appendChild(r.domElement);const l=new Q(u,r.domElement);u.position.set(0,1.6,5);const C=l.getObject();C?(p.add(C),C.position.y=1.6):console.error("No se pudo obtener el objeto de la cámara de los controles");const d={};document.addEventListener("keydown",i=>{d[i.code]=!0,i.code==="KeyP"&&(l.isLocked?l.unlock():l.lock().catch(e=>{console.error("Error al bloquear el puntero:",e)}))},!1);document.addEventListener("keyup",i=>{d[i.code]=!1},!1);const de=new ee(l),m=new Y(p,i=>{console.log("Portal clickeado:",i),de.show(i)});m.setControls&&m.setCamera&&(m.setControls(l),m.setCamera(u));f&&f.addEventListener("click",i=>{m.handleClick&&m.handleClick(i)});m.loadPortals&&m.loadPortals(te);new G;new L(0,0);new N;const A=new O;function W(){requestAnimationFrame(W);const i=A.getDelta();v=.5+.5*Math.sin(A.elapsedTime*oe),y.material.opacity=v*.5;const e=v*.8+.2;if(y.material.color.setRGB(e,e,e),l.isLocked){const n=5*Math.min(.1,i),t=(d.KeyD||d.ArrowRight?1:0)-(d.KeyA||d.ArrowLeft?1:0),o=(d.KeyW||d.ArrowUp?1:0)-(d.KeyS||d.ArrowDown?1:0);o!==0&&l.moveForward(o*n),t!==0&&l.moveRight(t*n);const a=50,c=l.getObject().position;c.x=T.clamp(c.x,-a,a),c.z=T.clamp(c.z,-a,a)}r.render(p,u)}function he(){if(!localStorage.getItem("hasSeenInstructions")){const i=document.createElement("div");i.id="instructions-modal",i.style.cssText=`
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
        `,i.appendChild(e),document.body.appendChild(i);const s=()=>{document.body.removeChild(i),localStorage.setItem("hasSeenInstructions","true"),window.focus(),window.removeEventListener("message",n)},n=o=>{o.data==="closeInstructions"&&s()};window.addEventListener("message",n,!1);const t=o=>{o.key==="Escape"&&s()};document.addEventListener("keydown",t),i._cleanup=()=>{document.removeEventListener("keydown",t)}}}he();window.addEventListener("resize",()=>{u.aspect=window.innerWidth/window.innerHeight,u.updateProjectionMatrix(),r.setSize(window.innerWidth,window.innerHeight)});f&&f.addEventListener("click",()=>{if(!l){console.error("Los controles no están inicializados correctamente");return}l.isLocked===!1&&(r.domElement.requestPointerLock=r.domElement.requestPointerLock||r.domElement.mozRequestPointerLock||r.domElement.webkitRequestPointerLock,r.domElement.requestPointerLock&&r.domElement.requestPointerLock())});document.addEventListener("pointerlockchange",S,!1);document.addEventListener("mozpointerlockchange",S,!1);document.addEventListener("webkitpointerlockchange",S,!1);function S(){document.pointerLockElement===r.domElement||document.mozPointerLockElement===r.domElement||document.webkitPointerLockElement===r.domElement?l.isLocked=!0:l.isLocked=!1}W();console.log("Presiona P para alternar el control del ratón");console.log("Haz clic en la pantalla para habilitar los controles");
