import React from 'react';
import {Route} from 'react-router-dom';
import Home from 'home';
import Tool from 'tool';

const Content = (props) => {
	return (
		<div className="text-center content">
			<Route path="/home" component={Home}/>
			<Route path="/map" component={() => {return <Tool type="map"/>}} />
			<Route path="/box" component={() => {return <Tool type="box"/>}} />
			<Route path="/chart" component={() => {return <Tool type="chart"/>}} />
		</div>
	);
}

export default Content;