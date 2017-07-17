import React, {Component} from 'react';
import Header from 'header';
import Content from 'content';
import Footer from 'footer';

class Main extends Component {
	constructor(props) {
		super(props);

		this.state = {
			active: "home"
		}

		//this binding
		this.changeTab = this.changeTab.bind(this);
	}

	changeTab(tab) {
		this.setState({active: tab});
	}

	render() {
		return (
			<div className="main">
				<Header activeTab={this.state.active} changeTab={this.changeTab}/>
				<Content />
				<Footer />
			</div>
		);
	}
}

export default Main;