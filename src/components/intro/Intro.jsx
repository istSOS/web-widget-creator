import React from 'react';
import {Link} from 'react-router-dom';

const Intro = (props) => {
	return (
		<div className="text-center intro">
			<div className="intro-container">
				<h1 className="intro-heading">IstSOS Web Widget Creator</h1>
				<Link to="/home">
					<button className="btn btn-default intro-button" onClick={props.handleIntro}>
						Enter
					</button>
				</Link>
			</div>
		</div>
	);
}

export default Intro;