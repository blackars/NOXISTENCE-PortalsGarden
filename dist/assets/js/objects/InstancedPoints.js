import {
	Mesh
} from '/assets/js/three.module.js';
import InstancedPointsGeometry from '/assets/js/geometries/InstancedPointsGeometry.js';
import InstancedPointsNodeMaterial from '/assets/js/nodes/materials/InstancedPointsNodeMaterial.js';

class InstancedPoints extends Mesh {

	constructor( geometry = new InstancedPointsGeometry(), material = new InstancedPointsNodeMaterial() ) {

		super( geometry, material );

		this.isInstancedPoints = true;

		this.type = 'InstancedPoints';

	}

}

export default InstancedPoints;
