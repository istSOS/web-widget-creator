import React from 'react';
import {Route} from 'react-router-dom';
import Home from 'home';

const Content = (props) => {
	return (
		<div className="text-center container content">
			<Route path="/home" component={Home}/>
		</div>
	);
}

export default Content;