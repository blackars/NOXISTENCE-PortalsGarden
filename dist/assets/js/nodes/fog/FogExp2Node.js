import FogNode from './FogNode.js';
import { positionView } from '/assets/js/accessors/PositionNode.js';
import { addNodeClass } from '/assets/js/core/Node.js';
import { addNodeElement, nodeProxy } from '/assets/js/shadernode/ShaderNode.js';

class FogExp2Node extends FogNode {

	constructor( colorNode, densityNode ) {

		super( colorNode );

		this.isFogExp2Node = true;

		this.densityNode = densityNode;

	}

	setup() {

		const depthNode = positionView.z.negate();
		const densityNode = this.densityNode;

		return densityNode.mul( densityNode, depthNode, depthNode ).negate().exp().oneMinus();

	}

}

export default FogExp2Node;

export const densityFog = nodeProxy( FogExp2Node );

addNodeElement( 'densityFog', densityFog );

addNodeClass( 'FogExp2Node', FogExp2Node );
