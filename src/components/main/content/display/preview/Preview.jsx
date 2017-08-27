import React, {Component} from 'react';
import BoxWidget from 'box-widget';

class Preview extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		let preview = "";
		if(this.props.preview != undefined) {
			preview = <BoxWidget preview={this.props.preview}/>
		}
		return (
			<div className="preview">
				<h4 htmlFor="preview">PREVIEW:</h4>
				<div id="preview" className="preview-container">
					{preview}
				</div>
			</div>
		)
	}
}

export default Preview;