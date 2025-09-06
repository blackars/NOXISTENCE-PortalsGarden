import NodeMaterial, { addNodeMaterial } from './NodeMaterial.js';
import { diffuseColor } from '/assets/js/core/PropertyNode.js';
import { directionToColor } from '/assets/js/utils/PackingNode.js';
import { materialOpacity } from '/assets/js/accessors/MaterialNode.js';
import { transformedNormalView } from '/assets/js/accessors/NormalNode.js';
import { float, vec4 } from '/assets/js/shadernode/ShaderNode.js';

import { MeshNormalMaterial } from '/assets/js/three.module.js';

const defaultValues = new MeshNormalMaterial();

class MeshNormalNodeMaterial extends NodeMaterial {

	constructor( parameters ) {

		super();

		this.isMeshNormalNodeMaterial = true;

		this.colorSpaced = false;

		this.setDefaultValues( defaultValues );

		this.setValues( parameters );

	}

	setupDiffuseColor() {

		const opacityNode = this.opacityNode ? float( this.opacityNode ) : materialOpacity;

		diffuseColor.assign( vec4( directionToColor( transformedNormalView ), opacityNode ) );

	}

}

export default MeshNormalNodeMaterial;

addNodeMaterial( 'MeshNormalNodeMaterial', MeshNormalNodeMaterial );
