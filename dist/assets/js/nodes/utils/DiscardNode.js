import CondNode from '/assets/js/math/CondNode.js';
import { expression } from '/assets/js/code/ExpressionNode.js';
import { addNodeClass } from '/assets/js/core/Node.js';
import { addNodeElement, nodeProxy } from '/assets/js/shadernode/ShaderNode.js';

let discardExpression;

class DiscardNode extends CondNode {

	constructor( condNode ) {

		discardExpression = discardExpression || expression( 'discard' );

		super( condNode, discardExpression );

	}

}

export default DiscardNode;

export const inlineDiscard = nodeProxy( DiscardNode );
export const discard = ( condNode ) => inlineDiscard( condNode ).append();

addNodeElement( 'discard', discard ); // @TODO: Check... this cause a little confusing using in chaining

addNodeClass( 'DiscardNode', DiscardNode );
