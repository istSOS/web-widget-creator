import React, {Component} from 'react';
import SidebarMap from 'sidebar-map';
import SidebarBox from 'sidebar-box';
import SidebarChart from 'sidebar-chart';
import Display from 'display';
import istsos from 'istsos-javascript-core';


class Tool extends Component {
   constructor(props) {
      super(props);

      this.state = {
      	config: {},
      	services: [],
      	offerings: [],
      	procedures: [],
      	properties: [],
         mapModel: {
            service: "",
            offering: "",
            procedures: [],
            property: "",
            id: "",
            class: "",
            width: "",
            height: "",
            auto_update: false,
            time_unit: "",
            start_delay: 0,
            interval: 0
         },
         boxModel: {
            service: "",
            offering: "",
            procedure: "",
            properties: [],
            layout: 'horizontal',
            id: "",
            class: "",
            width: "",
            height: "",
            auto_update: false,
            time_unit: "",
            start_delay: 0,
            interval: 0
         },
         chartModel: {
            service: "",
            offering: "",
            procedures: [],
            properties: [],
            from: "",
            to: "",
            gmt: "",
            chart_type: "",
            agg_func: "",
            agg_interval: "",
            color: "",
            color2: "",
            id: "",
            class: "",
            width: "",
            height: ""
         },
         active: null
      }

         //this binding
      this.updateModel = this.updateModel.bind(this);
      this.changeTab = this.changeTab.bind(this);
      this.populateOfferings = this.populateOfferings.bind(this);
      this.getOfferings = this.getOfferings.bind(this);
   }

   componentDidMount() {
      const db = new istsos.Database({
         dbname: 'istsos',
         host: 'localhost',
         user: 'postgres',
         password: 'postgres',
         port: 5432
      });

      const server = new istsos.Server({
         name: 'test',
         url: 'http://istsos.org/istsos/',
         defaultDb: db
      });

      this.setState({config: {
      	db: db,
      	server: server
      }})

      server.getServices()
      	.then((result) => {
      		let services = result.data.map((s) => {
      			return s.service;
      		})
      		this.setState({services: services})
      	})
   }

	changeTab(tab) {
		this.setState({active: tab});
	}

	getOfferings(serviceName) {
		let service = new istsos.Service({
			name: serviceName,
			server: this.state.config.server
		});

		return service.getOfferings();
	}

	populateOfferings(data) {
		console.log(data)
		let list = data.map((o) => {
			return o.name
		})
		this.setState({offerings: list})
	}

	getProcedures() {

	}

	getProperties() {

	}

	updateModel(tool, key, value) {
		switch(tool) {
			case 'map':
				let model = this.state.mapModel;
				console.log(model)
				model[key] = value;
				this.setState({mapModel: model})
				break;
			case 'box':
				this.setState({boxModel: model})
				break;
			case 'chart':
				this.setState({chartModel: model})
				break;
			default: 
				break;
		}
		console.log(this.state)
	}

	render() {
		let Sidebar;
		switch(this.props.type) {
			case 'map':
				Sidebar = <SidebarMap services={this.state.services} 
											 offerings={this.state.offerings}
											 procedures={this.state.procedures}
											 properties={this.state.properties}
											 update={this.updateModel} 
											 model={this.state.mapModel}
											 updateOfferings={this.populateOfferings}
											 config={this.state.config}
											 />
				break;
			case 'box':
				Sidebar = <SidebarBox services={this.state.services} update={this.updateModel} model={this.state.boxModel}/>
				break;
			case 'chart':
				Sidebar = <SidebarChart services={this.state.services} update={this.updateModel} model={this.state.chartModel}/>
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