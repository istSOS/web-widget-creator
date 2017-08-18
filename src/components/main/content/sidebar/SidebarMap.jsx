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

	getSamplingInterval(procedures) {
		//get list of intervals from tool state
		//for each begin find latest
		//for each end find earliest
		//store in object {begin: '', end: ''}
	}

	filterProcedures(list, condition_list) {
		let filtered = [];
		for(let i = 0; i < list.length; i++) {
			if(condition_list.indexOf(list[i]) > -1) {
				filtered.push(list[i]);
			}
		}
		return filtered;
	}

	generateOptions(list) {
		return list.map((item, i) => {
			return <option key={i} value={item.name}>{item.name}</option>
		});
	}

	generateOfferingOptions(list) {
		return list.map((item, i) => {
			return <option key={i} value={item.offeringName}>{item.offeringName}</option>
		});
	}

	generatePropertiesOptions(list) {
		return list.map((item, i) => {
			return <option key={i} value={item.observedName}>{item.observedName}</option>
		});
	}

	generateCheckboxes(list) {
		return list.map((item, i) => {
			return (
				<div key={i} className="checkbox">
  					<label><input type='checkbox' key={i} value={item.name} onChange={this.handleProceduresList}/> {item.name}</label>
				</div>
				)
		});
	}

	handleProceduresList(e) {
		let service = this.props.getItemByName(this.props.model.service.name, 'service');
		let procedure = this.props.getItemByName(e.target.value, 'procedure');
		let eventChecked = e.target.checked;
		service.getProcedures()
			.then((result) => {
				if(Object.keys(this.props.samplingTime).length == 0) {
					let samplingTime = {}
				
					result.data.forEach((p) => {
						samplingTime[p.name] = {
							begin: p.samplingTime.beginposition,
							end: p.samplingTime.endposition
						}
					});

					this.props.initSamplingTime(samplingTime);
				}
				


				if(Object.keys(this.props.allProperties) == 0) {
					result.data.forEach((procedure) => {
						this.props.initProperty(procedure)
					})
				}
				let checked = this.state.checkedProcedures;
				if (eventChecked) {
					checked.push(procedure)
				} else {
					checked.splice(checked.indexOf(procedure), 1);
				}
				let filtered = this.filterProcedures(this.props.procedures, checked);
				
				this.props.filterProperties(filtered);

				this.setState({
					checkedProcedures: checked
				});

				let timeModel = {}
				

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
									let service = this.props.getItemByName(e.target.value, 'service');
									service.getOfferings()
										.then((result) => {
											this.props.updateOfferings(result.data);
										});
										
									this.updateMapModel('service', service);
								}}>
									{this.generateOptions(this.props.services)}
								</select>
							</td>
						</tr>
						<tr>
							<td className="text-right">OFFERING:</td>
							<td>
								<select className="form-control" onChange={(e) => {
									let service = this.props.getItemByName(this.props.model.service.name, 'service');
									let offering = this.props.getItemByName(e.target.value, 'offering');

									offering.getMemberProcedures()
										.then((result) => {
											this.props.updateProcedures(result.data);
										})

									this.updateMapModel('offering', offering)
								}}>
									{this.generateOfferingOptions(this.props.offerings)}
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
								<select className="form-control" onChange={(e) => {
									let property = this.props.getItemByName(e.target.value, 'property')
									this.updateMapModel('property', property);
								}}>
									{this.generatePropertiesOptions(this.props.properties)}
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
						<button className="btn btn-danger" onClick={() => {this.props.generateWidget('map')}}>GENERATE</button>
					</div>
				</div>
			</div>
		)
	}
}

export default SidebarMap;