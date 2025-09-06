import ViewportTextureNode from './ViewportTextureNode.js';
import { addNodeClass } from '/assets/js/core/Node.js';
import { addNodeElement, nodeProxy } from '/assets/js/shadernode/ShaderNode.js';
import { viewportTopLeft } from './ViewportNode.js';
import { FramebufferTexture } from '/assets/js/three.module.js';

let _sharedFramebuffer = null;

class ViewportSharedTextureNode extends ViewportTextureNode {

	constructor( uvNode = viewportTopLeft, levelNode = null ) {

		if ( _sharedFramebuffer === null ) {

			_sharedFramebuffer = new FramebufferTexture();

		}

		super( uvNode, levelNode, _sharedFramebuffer );

	}

}

export default ViewportSharedTextureNode;

export const viewportSharedTexture = nodeProxy( ViewportSharedTextureNode );

addNodeElement( 'viewportSharedTexture', viewportSharedTexture );

addNodeClass( 'ViewportSharedTextureNode', ViewportSharedTextureNode );
