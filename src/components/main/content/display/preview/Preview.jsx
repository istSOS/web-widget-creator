import React, {Component} from 'react';

class Preview extends Component {
	constructor(props) {
		super(props)
	}

	render() {
		return (
			<div className="preview">
				<h4 htmlFor="preview">PREVIEW:</h4>
				<div id="preview" className="preview-container"></div>
			</div>
		)
	}
}

export default Preview;