import Sampler from '/assets/js/Sampler.js';

class NodeSampler extends Sampler {

	constructor( name, textureNode ) {

		super( name, textureNode ? textureNode.value : null );

		this.textureNode = textureNode;

	}

}

export default NodeSampler;
