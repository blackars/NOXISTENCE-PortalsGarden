import Node, { addNodeClass } from '/assets/js/core/Node.js';
import { nodeProxy } from '/assets/js/shadernode/ShaderNode.js';

class ExpressionNode extends Node {

	constructor( snippet = '', nodeType = 'void' ) {

		super( nodeType );

		this.snippet = snippet;

	}

	generate( builder, output ) {

		const type = this.getNodeType( builder );
		const snippet = this.snippet;

		if ( type === 'void' ) {

			builder.addLineFlowCode( snippet );

		} else {

			return builder.format( `( ${ snippet } )`, type, output );

		}

	}

}

export default ExpressionNode;

export const expression = nodeProxy( ExpressionNode );

addNodeClass( 'ExpressionNode', ExpressionNode );
