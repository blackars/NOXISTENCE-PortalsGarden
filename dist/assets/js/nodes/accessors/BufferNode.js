import UniformNode from '/assets/js/core/UniformNode.js';
import { addNodeClass } from '/assets/js/core/Node.js';
import { nodeObject } from '/assets/js/shadernode/ShaderNode.js';

class BufferNode extends UniformNode {

	constructor( value, bufferType, bufferCount = 0 ) {

		super( value, bufferType );

		this.isBufferNode = true;

		this.bufferType = bufferType;
		this.bufferCount = bufferCount;

	}

	getInputType( /*builder*/ ) {

		return 'buffer';

	}

}

export default BufferNode;

export const buffer = ( value, type, count ) => nodeObject( new BufferNode( value, type, count ) );

addNodeClass( 'BufferNode', BufferNode );
