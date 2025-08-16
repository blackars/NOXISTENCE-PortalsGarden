import{E as R,V as E,a as $,G as T,R as q,b as C,C as O,B as S,M as D,c as L,A as G,S as N,d as M,P as W,e as H,f as V,g as X,h as K,D as Y,W as Q}from"./GLTFLoader-Bgbh2E58.js";const u=new $(0,0,0,"YXZ"),y=new E,Z={type:"change"},U={type:"lock"},J={type:"unlock"},j=Math.PI/2;class ee extends R{constructor(e,t){super(),this.camera=e,this.domElement=t,this.isLocked=!1,this.minPolarAngle=0,this.maxPolarAngle=Math.PI,this.pointerSpeed=1,this._onMouseMove=te.bind(this),this._onPointerlockChange=oe.bind(this),this._onPointerlockError=ne.bind(this),this.connect()}connect(){this.domElement.ownerDocument.addEventListener("mousemove",this._onMouseMove),this.domElement.ownerDocument.addEventListener("pointerlockchange",this._onPointerlockChange),this.domElement.ownerDocument.addEventListener("pointerlockerror",this._onPointerlockError)}disconnect(){this.domElement.ownerDocument.removeEventListener("mousemove",this._onMouseMove),this.domElement.ownerDocument.removeEventListener("pointerlockchange",this._onPointerlockChange),this.domElement.ownerDocument.removeEventListener("pointerlockerror",this._onPointerlockError)}dispose(){this.disconnect()}getObject(){return this.camera}getDirection(e){return e.set(0,0,-1).applyQuaternion(this.camera.quaternion)}moveForward(e){const t=this.camera;y.setFromMatrixColumn(t.matrix,0),y.crossVectors(t.up,y),t.position.addScaledVector(y,e)}moveRight(e){const t=this.camera;y.setFromMatrixColumn(t.matrix,0),t.position.addScaledVector(y,e)}lock(){this.domElement.requestPointerLock()}unlock(){this.domElement.ownerDocument.exitPointerLock()}}function te(n){if(this.isLocked===!1)return;const e=n.movementX||n.mozMovementX||n.webkitMovementX||0,t=n.movementY||n.mozMovementY||n.webkitMovementY||0,s=this.camera;u.setFromQuaternion(s.quaternion),u.y-=e*.002*this.pointerSpeed,u.x-=t*.002*this.pointerSpeed,u.x=Math.max(j-this.maxPolarAngle,Math.min(j-this.minPolarAngle,u.x)),s.quaternion.setFromEuler(u),this.dispatchEvent(Z)}function oe(){this.domElement.ownerDocument.pointerLockElement===this.domElement?(this.dispatchEvent(U),this.isLocked=!0):(this.dispatchEvent(J),this.isLocked=!1)}function ne(){console.error("THREE.PointerLockControls: Unable to use Pointer Lock API")}class se{constructor(e,t){console.log("Inicializando PortalManager..."),this.scene=e,this.onPortalClick=t,this.portals=new Map,this.loader=new T,this.raycaster=new q,this.mouse=new C,this.controls=null,this.camera=null,this.mixers=[],this.clock=new O,this.loader.manager.onError=s=>{console.error("Error cargando recurso:",s)},this.handleClick=this.handleClick.bind(this),this.animate()}animate(){requestAnimationFrame(()=>this.animate());const e=this.clock.getDelta();for(const t of this.mixers)t.update(e)}setControls(e){return this.controls=e,this}setCamera(e){return this.camera=e,this}async loadPortals(e){for(const t of e)console.log(`Cargando portal: ${t.id} desde ${t.modelPath}`),this.loadModel(t)}createMarker(e){const t=new S(1,1,1),s=new D({color:65280,wireframe:!0,transparent:!0,opacity:.8}),o=new L(t,s);return o.position.set(e.position.x,e.position.y,e.position.z),o.scale.set(.5,.5,.5),o.userData={isPortal:!0,portalData:e,isPlaceholder:!0},o}loadModel(e){return console.log(`Cargando modelo: ${e.id} desde ${e.modelPath}`),new Promise((t,s)=>{this.loader.load(e.modelPath,o=>{var k,g,x;console.log(`✅ Modelo cargado: ${e.id}`);const i=o.scene;i.position.set(e.position.x,e.position.y,e.position.z),i.rotation.set(((k=e.rotation)==null?void 0:k.x)||0,((g=e.rotation)==null?void 0:g.y)||0,((x=e.rotation)==null?void 0:x.z)||0);const p=e.scale||1;if(i.scale.set(p,p,p),o.animations&&o.animations.length>0){console.log(`🔍 Se encontraron ${o.animations.length} animaciones`);const c=new G(i);this.mixers.push(c),o.animations.forEach(b=>{console.log(`▶️ Reproduciendo animación: ${b.name}`),c.clipAction(b).play()}),i.userData.mixer=c}else console.log("ℹ️ No se encontraron animaciones en el modelo");i.traverse(c=>{c.isMesh&&(c.castShadow=!0,c.receiveShadow=!0,c.userData={isPortal:!0,portalData:e})}),this.scene.add(i),this.portals.set(e.id,i),console.log("Modelo agregado a la escena:",i),t(i)},o=>{console.log(`${o.loaded/o.total*100}% cargado`)},o=>{console.error("❌ Error al cargar el modelo:",o),console.error("Ruta del error:",e.modelPath),s(o),console.log("Creando marcador de respaldo..."),this.createFallbackPortal(e)})})}createFallbackPortal(e){const t=new S(2,2,.2),s=new D({color:65280,transparent:!0,opacity:.7}),o=new L(t,s);o.position.set(e.position.x,e.position.y||1,e.position.z),o.userData={id:e.id,name:e.name,description:e.description||"Portal de ejemplo",thumbnail:e.thumbnail||"https://via.placeholder.com/300",isPortal:!0},this.portals.set(e.id,o),this.scene.add(o),console.log(`Portal de respaldo creado para: ${e.id}`)}handleClick(e){if(!this.camera)return;this.raycaster.setFromCamera(new C(0,0),this.camera);const t=[];this.portals.forEach(o=>{o.traverse(i=>{i.isMesh&&t.push(i)})});const s=this.raycaster.intersectObjects(t,!0);if(s.length>0){const o=s[0].object;o.userData.isPortal&&this.onPortalClick&&(this.onPortalClick(o.userData.portalData),this.controls&&this.controls.isLocked&&this.controls.unlock())}}getPortalById(e){return this.portals.get(e)}cleanup(){document.removeEventListener("click",this.handleClick,!1),this.portals.forEach(e=>{if(this.scene.remove(e),e.traverse&&e.traverse(t=>{t.geometry&&t.geometry.dispose(),t.material&&(Array.isArray(t.material)?t.material.forEach(s=>s.dispose()):t.material.dispose())}),e.userData.mixer){const t=this.mixers.indexOf(e.userData.mixer);t>-1&&this.mixers.splice(t,1)}}),this.portals.clear(),this.mixers=[]}}class ie{constructor(e=null){this.isOpen=!1,this.controls=e,this.createModal(),this.addEventListeners()}createModal(){this.modal=document.createElement("div"),this.modal.className="modal",this.modal.style.cssText=`
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
            max-width: 80%;
        `,this.title=document.createElement("h2"),this.title.className="modal-title",this.title.style.cssText=`
            margin: 0 0 1rem 0;
            font-size: 2rem;
            text-transform: uppercase;
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
        `,this.closeButton.addEventListener("mouseover",()=>{this.closeButton.style.background="white",this.closeButton.style.color="black",this.closeButton.style.transform="scale(1.05)"}),this.closeButton.addEventListener("mouseout",()=>{this.closeButton.style.background="transparent",this.closeButton.style.color="white",this.closeButton.style.transform="scale(1)"}),this.content.appendChild(this.title),this.content.appendChild(this.description),this.buttonsContainer.appendChild(this.openButton),this.buttonsContainer.appendChild(this.closeButton),this.content.appendChild(this.buttonsContainer),this.circle.appendChild(this.content),this.circleContainer.appendChild(this.circle),this.modal.appendChild(this.circleContainer),document.body.appendChild(this.modal)}addEventListeners(){this.closeButton.onclick=()=>this.hide(),this.modal.onclick=e=>{e.target===this.modal&&this.hide()},document.addEventListener("keydown",e=>{e.key==="Escape"&&this.isOpen&&this.hide()})}show(e){e&&(this.isOpen=!0,this.modal.style.display="flex",e.name&&(this.title.textContent=e.name),e.description&&(this.description.textContent=e.description),e.link?(this.openButton.style.display="inline-block",this.openButton.onclick=()=>{if(e.link.startsWith("http://")||e.link.startsWith("https://"))window.open(e.link,"_blank");else{const t=`/experiences/${e.link}`;window.open(t,"_blank")}this.hide()}):this.openButton.style.display="none",this.modal.offsetWidth,this.modal.style.opacity="1",setTimeout(()=>{const t=Math.min(window.innerWidth,window.innerHeight)*.8;this.circle.style.width=`${t}px`,this.circle.style.height=`${t}px`,setTimeout(()=>{this.content.style.opacity="1"},300)},10),document.body.style.cursor="auto",this.controls&&this.controls.unlock())}hide(){this.content.style.transition="opacity 0.3s ease-out",this.content.style.opacity="0",this.circle.style.transition="width 0.4s ease-out, height 0.4s ease-out",this.circle.style.width="0",this.circle.style.height="0",setTimeout(()=>{this.modal.style.transition="opacity 0.3s ease-out",this.modal.style.opacity="0"},50),setTimeout(()=>{this.modal.style.display="none",this.content.style.transition="",this.circle.style.transition="",this.modal.style.transition="",document.body.style.cursor="none",this.controls&&this.controls.lock(),this.cleanup()},400)}cleanup(){}}const re=[{id:"LifeGame",name:"Life's Game",modelPath:"/assets/models/PortalCube.glb",position:{x:5,y:0,z:-5},rotation:{x:0,y:0,z:0},scale:1,description:"El Juego de la Vida",link:"MaxkodiaPlanet/maxkodiaplanet.html"},{id:"portal-1",name:"Proyecto 1",modelPath:"/assets/models/Adenina.glb",position:{x:-5,y:0,z:-5},rotation:{x:0,y:Math.PI/4,z:0},scale:2,description:"Descripción del proyecto 1",link:"AnothEarth/anothearth.html"},{id:"portal-2",name:"Proyecto 1",modelPath:"/assets/models/Adenina.glb",position:{x:-25,y:0,z:-25},rotation:{x:0,y:Math.PI/4,z:0},scale:.2,description:"Descripción del proyecto 1",link:"https://ejemplo.com/experiencia"},{id:"portal-3",name:"Proyecto 1",modelPath:"/assets/models/Adenina.glb",position:{x:25,y:0,z:25},rotation:{x:0,y:Math.PI/4,z:0},scale:2,description:"Descripción del proyecto 1",link:"https://ejemplo.com/experiencia"},{id:"portal-4",name:"Proyecto 1",modelPath:"/assets/models/Adenina.glb",position:{x:45,y:0,z:35},rotation:{x:0,y:Math.PI/4,z:0},scale:2,description:"Descripción del proyecto 1",link:"https://ejemplo.com/experiencia"}];let v=1;const ae=.5,f=document.getElementById("container"),h=new N;h.background=new M(16777215);const d=new W(75,window.innerWidth/window.innerHeight,.1,1e3);d.name="camera";const ce=new H(100,100),le=new V({color:16777215,roughness:.8,metalness:0,transparent:!0,opacity:0}),z=new L(ce,le);z.rotation.x=-Math.PI/2;z.receiveShadow=!0;h.add(z);const de=100,me=50,he=new M(0),pe=new M(0),w=new X(de,me,he,pe);w.material.opacity=.5;w.material.transparent=!0;w.position.y=.01;h.add(w);const ue=new K(16777215,.8);h.add(ue);const B=new Y(16777215,.8);B.position.set(1,1,1);B.castShadow=!0;h.add(B);f||console.error('No se encontró el elemento con id "container"');const r=new Q({antialias:!0});r.setSize(window.innerWidth,window.innerHeight);r.shadowMap.enabled=!0;f.appendChild(r.domElement);const a=new ee(d,r.domElement);d.position.set(0,1.6,5);const P=a.getObject();P?(h.add(P),P.position.y=1.6):console.error("No se pudo obtener el objeto de la cámara de los controles");const I=5,l={};document.addEventListener("keydown",n=>{l[n.code]=!0,n.code==="KeyP"&&(a.isLocked?a.unlock():a.lock().catch(e=>{console.error("Error al bloquear el puntero:",e)}))},!1);document.addEventListener("keyup",n=>{l[n.code]=!1},!1);const ye=new ie(a),m=new se(h,n=>{console.log("Portal clickeado:",n),ye.show(n)});m.setControls&&m.setCamera&&(m.setControls(a),m.setCamera(d));f&&f.addEventListener("click",n=>{m.handleClick&&m.handleClick(n)});m.loadPortals&&m.loadPortals(re);new q;new C(0,0);new T;const _=new O;function F(){requestAnimationFrame(F);const n=_.getDelta();v=.5+.5*Math.sin(_.elapsedTime*ae),w.material.opacity=v*.5;const e=v*.8+.2;if(w.material.color.setRGB(e,e,e),a.isLocked){const t=new E,s=a.getObject()||d,o=new E(0,0,-1).applyQuaternion(s.quaternion),i=new E(1,0,0).applyQuaternion(s.quaternion);(l.KeyW||l.ArrowUp)&&t.add(o),(l.KeyS||l.ArrowDown)&&t.sub(o),(l.KeyA||l.ArrowLeft)&&t.sub(i),(l.KeyD||l.ArrowRight)&&t.add(i),t.y=0,t.lengthSq()>0&&t.normalize();const p=new E().copy(d.position),k=t.x*I*n,g=-t.z*I*n,x=50,c=p.x+k,b=p.z+g;Math.abs(c)<=x&&a.moveRight(k),Math.abs(b)<=x&&a.moveForward(g)}r.render(h,d)}function fe(){if(!localStorage.getItem("hasSeenInstructions")){const n=document.createElement("div");n.id="instructions-modal",n.style.cssText=`
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
        `,n.appendChild(e),document.body.appendChild(n);const t=()=>{document.body.removeChild(n),localStorage.setItem("hasSeenInstructions","true"),window.focus(),window.removeEventListener("message",s)},s=i=>{i.data==="closeInstructions"&&t()};window.addEventListener("message",s,!1);const o=i=>{i.key==="Escape"&&t()};document.addEventListener("keydown",o),n._cleanup=()=>{document.removeEventListener("keydown",o)}}}fe();window.addEventListener("resize",()=>{d.aspect=window.innerWidth/window.innerHeight,d.updateProjectionMatrix(),r.setSize(window.innerWidth,window.innerHeight)});f&&f.addEventListener("click",()=>{if(!a){console.error("Los controles no están inicializados correctamente");return}a.isLocked===!1&&(r.domElement.requestPointerLock=r.domElement.requestPointerLock||r.domElement.mozRequestPointerLock||r.domElement.webkitRequestPointerLock,r.domElement.requestPointerLock&&r.domElement.requestPointerLock())});document.addEventListener("pointerlockchange",A,!1);document.addEventListener("mozpointerlockchange",A,!1);document.addEventListener("webkitpointerlockchange",A,!1);function A(){document.pointerLockElement===r.domElement||document.mozPointerLockElement===r.domElement||document.webkitPointerLockElement===r.domElement?a.isLocked=!0:a.isLocked=!1}F();console.log("Presiona P para alternar el control del ratón");console.log("Haz clic en la pantalla para habilitar los controles");
