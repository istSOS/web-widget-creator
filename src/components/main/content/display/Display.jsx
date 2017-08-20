import React, {Component} from 'react';
import Preview from 'preview';
import Code from 'code';

class Display extends Component {
	constructor(props) {
		super(props)
	}

	render() {
		return (
			<div className="container-fluid">
				<div className="row">
					<Preview />
				</div>
				<hr/>
				<div className="row">
					<Code code={this.props.code}/>
				</div>
			</div>
		)
	}
}

export default Display;