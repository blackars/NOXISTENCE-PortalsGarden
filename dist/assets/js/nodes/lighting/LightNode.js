import Node, { addNodeClass } from '/assets/js/core/Node.js';
import { nodeProxy } from '/assets/js/shadernode/ShaderNode.js';
import { objectPosition } from '/assets/js/accessors/Object3DNode.js';
import { cameraViewMatrix } from '/assets/js/accessors/CameraNode.js';

class LightNode extends Node {

	constructor( scope = LightNode.TARGET_DIRECTION, light = null ) {

		super();

		this.scope = scope;
		this.light = light;

	}

	setup() {

		const { scope, light } = this;

		let output = null;

		if ( scope === LightNode.TARGET_DIRECTION ) {

			output = cameraViewMatrix.transformDirection( objectPosition( light ).sub( objectPosition( light.target ) ) );

		}

		return output;

	}

	serialize( data ) {

		super.serialize( data );

		data.scope = this.scope;

	}

	deserialize( data ) {

		super.deserialize( data );

		this.scope = data.scope;

	}

}

LightNode.TARGET_DIRECTION = 'targetDirection';

export default LightNode;

export const lightTargetDirection = nodeProxy( LightNode, LightNode.TARGET_DIRECTION );

addNodeClass( 'LightNode', LightNode );
