import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter, Route} from 'react-router-dom';
import Intro from 'intro';
import Main from 'main';

class App extends Component {
	constructor(props) {
		super(props);
		
		this.state = {
			intro: true
		};
	}

	handleIntro() {
		this.setState({
			intro: false
		})
	}

	render() {
		const intro = (this.state.intro) ? <Intro handleIntro={() => {this.handleIntro()}}/> : null;

		return (
			<div>
				{intro}
				<Route exact path='/home' component={Main}/>
			</div>
		);
	}
}

ReactDOM.render(
	<BrowserRouter>
		<App />
	</BrowserRouter>
	, document.getElementById('app'));