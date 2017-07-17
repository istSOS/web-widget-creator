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

		//this bindings
		this.handleIntro = this.handleIntro.bind(this);
	}

	handleIntro() {
		this.setState({
			intro: false
		})
	}

	render() {
		const intro = (this.state.intro) ? <Intro handleIntro={this.handleIntro}/> : <Main />;

		return (
			<div>
				{intro}
			</div>
		);
	}
}

ReactDOM.render(
	<BrowserRouter>
		<App />
	</BrowserRouter>
	, document.getElementById('app'));