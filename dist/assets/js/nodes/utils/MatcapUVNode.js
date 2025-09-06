import TempNode from '/assets/js/core/TempNode.js';
import { transformedNormalView } from '/assets/js/accessors/NormalNode.js';
import { positionViewDirection } from '/assets/js/accessors/PositionNode.js';
import { nodeImmutable, vec2, vec3 } from '/assets/js/shadernode/ShaderNode.js';
import { addNodeClass } from '/assets/js/core/Node.js';

class MatcapUVNode extends TempNode {

	constructor() {

		super( 'vec2' );

	}

	setup() {

		const x = vec3( positionViewDirection.z, 0, positionViewDirection.x.negate() ).normalize();
		const y = positionViewDirection.cross( x );

		return vec2( x.dot( transformedNormalView ), y.dot( transformedNormalView ) ).mul( 0.495 ).add( 0.5 );

	}

}

export default MatcapUVNode;

export const matcapUV = nodeImmutable( MatcapUVNode );

addNodeClass( 'MatcapUVNode', MatcapUVNode );
