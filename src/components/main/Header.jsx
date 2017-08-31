import React, {Component} from 'react';
import {Link} from 'react-router-dom';

class Header extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div className="header">
				<nav className="navbar navbar-default">
					<div className="container-fluid">
				   	<div className="navbar-header">
				      	<a className="navbar-brand" href="#">IstSOS Web Widget Creator</a>
				    	</div>
				   	<ul className="nav navbar-nav">
					      <li className={'header-tab ' + ((this.props.activeTab === 'home') ? 'active-tab' : '')}><Link onClick={() => {this.props.changeTab('home')}} to="/home">HOME</Link></li>
					      <li className={'header-tab ' + ((this.props.activeTab === 'map') ? 'active-tab' : '')}><Link onClick={() => {this.props.changeTab('map')}} to="/map">MAP</Link></li>
					      <li className={'header-tab ' + ((this.props.activeTab === 'box') ? 'active-tab' : '')}><Link onClick={() => {this.props.changeTab('box')}} to="/box">BOX</Link></li>
					      {/*<li className={'header-tab ' + ((this.props.activeTab === 'chart') ? 'active-tab' : '')}><Link onClick={() => {this.props.changeTab('chart')}} to="/chart">CHART</Link></li>*/}
				    	</ul>
				  	</div>
				</nav>
			</div>
		);
	}
}

export default Header;