import { vec4, MeshBasicNodeMaterial } from '/assets/js/../nodes/Nodes.js';
import QuadMesh from '/assets/js/../objects/QuadMesh.js';

const quadMesh = new QuadMesh( new MeshBasicNodeMaterial() );

class PostProcessing {

	constructor( renderer, outputNode = vec4( 0, 0, 1, 1 ) ) {

		this.renderer = renderer;
		this.outputNode = outputNode;

	}

	async render() {

		quadMesh.material.fragmentNode = this.outputNode;

		await quadMesh.render( this.renderer );

	}

}

export default PostProcessing;
