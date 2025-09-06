import NodeParser from '/assets/js/../../nodes/core/NodeParser.js';
import WGSLNodeFunction from './WGSLNodeFunction.js';

class WGSLNodeParser extends NodeParser {

	parseFunction( source ) {

		return new WGSLNodeFunction( source );

	}

}

export default WGSLNodeParser;
