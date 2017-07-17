import React from 'react';
import {Link} from 'react-router-dom';

const Intro = (props) => {
	return (
		<div className="text-center intro">
			<div className="intro-container">
				<h1 className="intro-heading">IstSOS Web Widget Creator</h1>
				<button className="btn btn-default intro-button" onClick={props.handleIntro}>
					<Link to="/home">Enter</Link>
				</button>
			</div>
		</div>
	);
}

export default Intro;