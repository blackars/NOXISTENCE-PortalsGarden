import SpotLightNode from './SpotLightNode.js';
import { addLightNode } from './LightsNode.js';
import { texture } from '/assets/js/accessors/TextureNode.js';
import { vec2 } from '/assets/js/shadernode/ShaderNode.js';
import { addNodeClass } from '/assets/js/core/Node.js';

import IESSpotLight from '/assets/js/../lights/IESSpotLight.js';

class IESSpotLightNode extends SpotLightNode {

	getSpotAttenuation( angleCosine ) {

		const iesMap = this.light.iesMap;

		let spotAttenuation = null;

		if ( iesMap && iesMap.isTexture === true ) {

			const angle = angleCosine.acos().mul( 1.0 / Math.PI );

			spotAttenuation = texture( iesMap, vec2( angle, 0 ), 0 ).r;

		} else {

			spotAttenuation = super.getSpotAttenuation( angleCosine );

		}

		return spotAttenuation;

	}

}

export default IESSpotLightNode;

addNodeClass( 'IESSpotLightNode', IESSpotLightNode );

addLightNode( IESSpotLight, IESSpotLightNode );
