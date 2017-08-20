import React, {Component} from 'react';

class Code extends Component {
	constructor(props) {
		super(props)
	}

	render() {
		return (
			<div className="code">
				<div className="form-group">
				  <h4 htmlFor="code">CODE:</h4>
				  <textarea className="form-control" rows="8" id="code" value={this.props.code}></textarea>
				</div>
			</div>
		)
	}
}

export default Code;