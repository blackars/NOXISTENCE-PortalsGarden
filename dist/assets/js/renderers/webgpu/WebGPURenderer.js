import WebGPU from '/assets/js/../capabilities/WebGPU.js';

import Renderer from '/assets/js/common/Renderer.js';
import WebGLBackend from '/assets/js/webgl/WebGLBackend.js';
import WebGPUBackend from './WebGPUBackend.js';
/*
const debugHandler = {

	get: function ( target, name ) {

		// Add |update
		if ( /^(create|destroy)/.test( name ) ) console.log( 'WebGPUBackend.' + name );

		return target[ name ];

	}

};
*/
class WebGPURenderer extends Renderer {

	constructor( parameters = {} ) {

		let BackendClass;

		if ( parameters.forceWebGL ) {

			BackendClass = WebGLBackend;

		} else if ( WebGPU.isAvailable() ) {

			BackendClass = WebGPUBackend;

		} else {

			BackendClass = WebGLBackend;

			console.warn( 'THREE.WebGPURenderer: WebGPU is not available, running under WebGL2 backend.' );

		}

		const backend = new BackendClass( parameters );

		//super( new Proxy( backend, debugHandler ) );
		super( backend, parameters );

		this.isWebGPURenderer = true;

	}

}

export default WebGPURenderer;
