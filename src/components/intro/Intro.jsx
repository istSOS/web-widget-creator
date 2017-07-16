import React, {Component} from 'react';
import {Link} from 'react-router-dom';

class Intro extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div className="text-center intro">
				<h1 className="intro-heading">IstSOS Web Widget Creator</h1>
				<button className="btn btn-default intro-button" onClick={this.props.handleIntro}>
					<Link to="/home">Enter</Link>
				</button>
			</div>
		);
	}
}

export default Intro;