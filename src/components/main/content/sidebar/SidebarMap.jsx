import React, {Component} from 'react';
import istsos from 'istsos-javascript-core';

class SidebarMap extends Component {
	constructor(props) {
		super(props)
		this.state = {
			checkedProcedures: [],
			autoUpdate: 'hidden'
		}

		this.handleProceduresList = this.handleProceduresList.bind(this);
	}

	componentDidMount() {
		// this.props.reset('map');
	}

	updateMapModel(key, value) {
		this.props.update('map', key, value);
	}

	filterProcedures(list, condition_list) {
		let filtered = [];
		list.forEach((procedure) => {
			if(condition_list.indexOf(procedure.name) != -1) {
				filtered.push(procedure)
			}
		})

		return filtered
	}

	generateOptions(list) {
		return list.map((item, i) => {
			return <option key={i} value={item}>{item}</option>
		});
	}

	generateCheckboxes(list) {
		return list.map((item, i) => {
			return (
				<div key={i} className="checkbox">
  					<label><input type='checkbox' key={i} value={item} onChange={this.handleProceduresList}/> {item}</label>
				</div>
				)
		});
	}

	handleProceduresList(e) {
		let eventValue = e.target.value;
		let eventChecked = e.target.checked;
		let service = new istsos.Service({
			name: this.props.model.service,
			server: this.props.config.server,
			opt_config: new istsos.Configuration({
				serviceName: this.props.model.service,
				server: this.props.config.server
			})
		});

		service.getProcedures()
			.then((result) => {
				let checked = this.state.checkedProcedures;

				if (eventChecked) {
					checked.push(eventValue)
				} else {
					checked.splice(checked.indexOf(eventValue), 1);
				}

				let filtered = this.filterProcedures(result.data, checked);
				this.props.filterProperties(filtered);

				this.setState({
					checkedProcedures: checked
				});
				this.updateMapModel('procedures', this.state.checkedProcedures);
			})
		
	}

	render() {
		return (
			<div className="map text-center">
				<div className="row text-center">
					<div className="col-xs-12">
					<h4>SENSOR SETTINGS</h4>
					<table className="table sidebar-table">
						<tbody>
						<tr>
							<td className="text-right">SERVICE:</td>
							<td>
								<select className="form-control" onChange={(e) => {
									let service = new istsos.Service({
										name: e.target.value,
										server: this.props.config.server,
										opt_config: new istsos.Configuration({
											serviceName: e.target.value,
											server: this.props.config.server
										})
									});

									service.getOfferings()
										.then((result) => {
											this.props.updateOfferings(result.data);
										})
										
									this.updateMapModel('service', e.target.value)
								}}>
									{this.generateOptions(this.props.services)}
								</select>
							</td>
						</tr>
						<tr>
							<td className="text-right">OFFERING:</td>
							<td>
								<select className="form-control" onChange={(e) => {
									let service = new istsos.Service({
										name: this.props.model.service,
										server: this.props.config.server,
										opt_config: new istsos.Configuration({
											serviceName: this.props.model.service,
											server: this.props.config.server
										})
									});

									let offering = new istsos.Offering({
										offeringName: e.target.value,
										active: true,
										service: service
									})

									offering.getMemberProcedures()
										.then((result) => {
											this.props.updateProcedures(result.data);
										})

									this.updateMapModel('offering', e.target.value)}}>
									{this.generateOptions(this.props.offerings)}
								</select>
							</td>
						</tr>
						<tr>
							<td className="text-right">PROCEDURES:</td>
							<td className="text-left">{this.generateCheckboxes(this.props.procedures)}</td>
						</tr>
						<tr>
							<td className="text-right">PROPERTY:</td>
							<td>
								<select className="form-control" onChange={(e) => {this.updateMapModel('property', e.target.value)}}>
									{this.generateOptions(this.props.properties)}
								</select>
							</td>
						</tr>
						</tbody>
					</table>
					</div>
				</div>
				<hr/>
				<div className="row text-center">
					<div className="col-xs-12">
						<h4>WIDGET SETTINGS</h4>
						<table className="table sidebar-table">
							<tbody>
								<tr>
									<td className="text-right">ID:</td>
									<td>
										<input type="text" className="form-control" onChange={(e) => {this.updateMapModel('id', e.target.value)}}/>
									</td>
								</tr>
								<tr>
									<td className="text-right">CLASS:</td>
									<td>
										<input type="text" className="form-control" onChange={(e) => {this.updateMapModel('class', e.target.value)}}/>
									</td>
								</tr>
								<tr>
									<td className="text-right">HEIGHT:</td>
									<td>
										<input type="text" className="form-control" onChange={(e) => {this.updateMapModel('height', e.target.value)}}/>
									</td>
								</tr>
								<tr>
									<td className="text-right">WIDTH:</td>
									<td>
										<input type="text" className="form-control" onChange={(e) => {this.updateMapModel('width', e.target.value)}}/>
									</td>
								</tr>
								</tbody>
						</table>
					</div>
				</div>
				<hr/>
				<div className="row text-center">
					<div className="col-xs-12">
						<h4>AUTOMATIC UPDATE SETTINGS</h4>
						<div className="checkbox">
  							<label><input type="checkbox" 
  											  onChange={(e) => {this.updateMapModel('auto_update', e.target.checked)
  																	  if(e.target.checked) {
  																	  	  this.setState({autoUpdate: ''})
  																	  } else {
  																	  		console.log(this.state)
  																	  	  this.setState({autoUpdate: 'hidden'})
  																	  }
  									}}/>ON/OFF</label>
						</div>
						<table className={`table sidebar-table ${this.state.autoUpdate}`}>
							<tbody>
								<tr>
									<td className="text-right">TIME UNIT:</td>
									<td>
										<select className="form-control" onChange={(e) => {this.updateMapModel('time_unit', e.target.value)}}>
											<option>Seconds</option>
											<option>Minutes</option>
											<option>Hours</option>
										</select>
									</td>
								</tr>
								<tr>
									<td className="text-right">START DELAY:</td>
									<td>
										<input type="text" className="form-control" onChange={(e) => {this.updateMapModel('start_delay', e.target.value)}}/>
									</td>
								</tr>
								<tr>
									<td className="text-right">INTERVAL:</td>
									<td>
										<input type="text" className="form-control" onChange={(e) => {this.updateMapModel('interval', e.target.value)}}/>
									</td>
								</tr>
							</tbody>
						</table>
					</div>
				</div>
				<hr/>
				<div className="row text-center home-end">
					<div className="col-xs-12">
						<button className="btn btn-danger" onClick={() => {generateWidget('map')}}>GENERATE</button>
					</div>
				</div>
			</div>
		)
	}
}

export default SidebarMap;