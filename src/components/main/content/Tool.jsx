import React, {Component} from 'react';
import SidebarMap from 'sidebar-map';
import SidebarBox from 'sidebar-box';
import SidebarChart from 'sidebar-chart';
import Display from 'display';


class Tool extends Component {
	constructor(props) {
		super(props);
		//this binding
		this.changeTab = this.changeTab.bind(this);

	}

	changeTab(tab) {
		this.setState({active: tab});
	}

	render() {
		let Sidebar;
		switch(this.props.type) {
			case 'map':
				Sidebar = <SidebarMap />
				break;
			case 'box':
				Sidebar = <SidebarBox />
				break;
			case 'chart':
				Sidebar = <SidebarChart />
				break;
			default: 
				break;
		}

		return (
			<div className="tool container-fluid">
				<div className="row">
					<div className="col-md-4 col-sm-6">
						{Sidebar}
					</div>
					<div className="col-md-8 col-sm-6">
						<Display />
					</div>
				</div>
			</div>
		);
	}
}

export default Tool;