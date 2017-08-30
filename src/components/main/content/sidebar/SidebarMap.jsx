import React, {Component} from 'react';
import istsos from 'istsos-javascript-core';
import {WidgetFunctions} from 'istsos-widget';

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
		let intervalList = [];
		procedures.forEach((procedure) => {
			intervalList.push({
				begin: this.props.samplingTime[procedure].begin,
				end: this.props.samplingTime[procedure].end,
			});
		})
		let begin = intervalList[0].begin;
		let end = intervalList[0].end;

		for (let i = 1; i < intervalList.length; i++) {
			begin = WidgetFunctions.olderDate(begin, intervalList[i].begin);
			end = WidgetFunctions.newerDate(end, intervalList[i].end);
		}
		return {begin, end};
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
		let none = [<option key={-1} value="none">-- Select from the list --</option>];
		let options = list.map((item, i) => {
			return <option key={i} value={item}>{item}</option>
		});
		return none.concat(options)
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
		let service = this.props.activeSettings.service;
		let procedureValue = e.target.value;
		let procedureChecked = e.target.checked;
		service.getProcedures()
			.then((result) => {
				if(Object.keys(this.props.samplingTime).length == 0) {
					let samplingTime = {}
				
					result.data.forEach((procedure) => {
						samplingTime[procedure.name] = {
							begin: procedure.samplingTime.beginposition,
							end: procedure.samplingTime.endposition
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
				if (procedureChecked) {
					checked.push(procedureValue)
				} else {
					checked.splice(checked.indexOf(procedureValue), 1);
				}

				if(checked.length == 0) {
					this.props.updateProperties([])
				}

				let filtered = this.filterProcedures(this.props.procedures, checked);
				
				this.props.filterProperties(filtered);

				this.setState({
					checkedProcedures: checked
				});

				let timeModel = this.getSamplingInterval(checked);

				let activeProcedures = [];
				checked.forEach((name) => {
					let procedure = new istsos.Procedure({
						name: name,
						foi_name: 'wwc',
						epsg: 3857,
						x: 5,
						y: 5,
						z: 5,
						outputs: [],
						systemType: 'insitu-fixed-point',
						service: this.props.activeSettings.service
					});
					activeProcedures.push(procedure);
				})

				this.props.setActive('procedures', activeProcedures);
				
				this.updateMapModel('samplingTime', timeModel);
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
					            if (e.target.value !== 'none') {
					               let service = new istsos.Service({
					                  name: e.target.value,
					                  opt_db: this.props.config.db,
					                  server: this.props.config.server
					               });

					               this.props.setActive('service', service);

					               service.getOfferings()
					                  .then((result) => {
					                     this.props.updateOfferings(result.data);
					                     this.props.updateProcedures([]);
					            			this.props.updateProperties([]);
					                  });

					               this.updateMapModel('service', e.target.value);

					            } else {
					            	this.props.updateOfferings([]);
					            	this.props.updateProcedures([]);
					            	this.props.updateProperties([]);
					            }
								}}>
									{this.generateOptions(this.props.services)}
								</select>
							</td>
						</tr>
						<tr>
							<td className="text-right">OFFERING:</td>
							<td>
								<select className="form-control" onChange={(e) => {
									let service = this.props.activeSettings.service;
									let offering = new istsos.Offering({
										offeringName: e.target.value,
										active: true,
										service: service
									})

									this.props.setActive('offering', offering);

									offering.getMemberProcedures()
										.then((result) => {
											this.props.updateProcedures(result.data);
											this.props.updateProperties([]);
										})

									this.updateMapModel('offering', e.target.value)
								}}>
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
								<select className="form-control" onChange={(e) => {
									let activeProperty = new istsos.ObservedProperty({
										observedName: e.target.value,
										definitionUrn: this.props.observedPropertyMap[e.target.value].urn,
										service: this.props.activeSettings.service,
										constraintType: 'lessThan',
										value: 1000
									})
									this.props.setActive('properties', [activeProperty]);
									this.updateMapModel('property', e.target.value);
								}}>
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
						<button className="btn btn-danger" onClick={() => {this.props.generateWidget('map')}}>GENERATE</button>
					</div>
				</div>
			</div>
		)
	}
}

export default SidebarMap;