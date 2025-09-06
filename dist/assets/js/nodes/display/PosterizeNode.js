import TempNode from '/assets/js/core/TempNode.js';
import { addNodeClass } from '/assets/js/core/Node.js';
import { addNodeElement, nodeProxy } from '/assets/js/shadernode/ShaderNode.js';

class PosterizeNode extends TempNode {

	constructor( sourceNode, stepsNode ) {

		super();

		this.sourceNode = sourceNode;
		this.stepsNode = stepsNode;

	}

	setup() {

		const { sourceNode, stepsNode } = this;

		return sourceNode.mul( stepsNode ).floor().div( stepsNode );

	}

}

export default PosterizeNode;

export const posterize = nodeProxy( PosterizeNode );

addNodeElement( 'posterize', posterize );

addNodeClass( 'PosterizeNode', PosterizeNode );
