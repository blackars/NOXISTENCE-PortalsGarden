import ViewportTextureNode from './ViewportTextureNode.js';
import { addNodeClass } from '/assets/js/core/Node.js';
import { addNodeElement, nodeProxy } from '/assets/js/shadernode/ShaderNode.js';
import { viewportTopLeft } from './ViewportNode.js';
import { DepthTexture } from '/assets/js/three.module.js';

let sharedDepthbuffer = null;

class ViewportDepthTextureNode extends ViewportTextureNode {

	constructor( uvNode = viewportTopLeft, levelNode = null ) {

		if ( sharedDepthbuffer === null ) {

			sharedDepthbuffer = new DepthTexture();

		}

		super( uvNode, levelNode, sharedDepthbuffer );

	}

}

export default ViewportDepthTextureNode;

export const viewportDepthTexture = nodeProxy( ViewportDepthTextureNode );

addNodeElement( 'viewportDepthTexture', viewportDepthTexture );

addNodeClass( 'ViewportDepthTextureNode', ViewportDepthTextureNode );
