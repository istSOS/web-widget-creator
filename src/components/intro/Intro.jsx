import React, {Component} from 'react';

class Intro extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div className="text-center intro">
				<h1 className="intro-heading">IstSOS Web Widget Creator</h1>
				<button className="btn btn-default intro-button">Enter</button>
			</div>
		);
	}
}

export default Intro;