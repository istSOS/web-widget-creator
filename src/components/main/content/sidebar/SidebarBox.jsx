import React, {Component} from 'react';
import istsos from 'istsos-javascript-core';

class SidebarBox extends Component {
	constructor(props) {
		super(props)
		this.state = {
			checkedProperties: [],
			autoUpdate: 'hidden',
			checkedLayout: 'horizontal' 
		}

		this.handlePropertiesList = this.handlePropertiesList.bind(this);
		this.handleLayout = this.handleLayout.bind(this);
	}

	updateBoxModel(key, value) {
		this.props.update('box', key, value);
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
  					<label><input type='checkbox' key={i} value={item} onChange={this.handlePropertiesList}/> {item}</label>
				</div>
				)
		});
	}

	handleLayout(e) {
		this.setState({checkedLayout: e.target.value})
		this.updateBoxModel('layout', e.target.value)
	}

	handlePropertiesList(e) {
			let eventValue = e.target.value;
			let eventChecked = e.target.checked;

			let checked = this.state.checkedProperties;

			if (eventChecked) {
				checked.push(eventValue)
			} else {
				checked.splice(checked.indexOf(eventValue), 1);
			}

			let activeProperties = [];
			checked.forEach((propName) => {
				let property = new istsos.ObservedProperty({
					observedName: propName,
					definitionUrn: this.props.observedPropertyMap[propName].urn,
					service: this.props.activeSettings.service,
					constraintType: 'lessThan',
					value: 1000
				})
				activeProperties.push(property);
			});

			this.props.setActive('properties', activeProperties)
			this.updateBoxModel('properties', checked);
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
					                  server: this.props.config.server,
					                  opt_config: new istsos.Configuration({
					                     serviceName: e.target.value,
					                     server: this.props.config.server
					                  })
					               });

					               this.props.setActive('service', service);

					               service.getOfferings()
					                  .then((result) => {
					                     this.props.updateOfferings(result.data);
					                     this.props.updateProcedures([]);
					                     this.props.updateProperties([]);
					                  })

					               this.updateBoxModel('service', e.target.value)
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
											this.props.updateProperties([])
										})

									this.updateBoxModel('offering', e.target.value)}}>
									{this.generateOptions(this.props.offerings)}
								</select>
							</td>
						</tr>
						<tr>
							<td className="text-right">PROCEDURE:</td>
							<td>
								<select className="form-control" onChange={(e) => {
									let service = this.props.activeSettings.service;

									let procedure = new istsos.Procedure({
										name: e.target.value,
										foi_name: 'wwc',
										epsg: 3857,
										x: 5,
										y: 5,
										z: 5,
										outputs: [],
										systemType: 'insitu-fixed-point',
										service: service
									})

									this.props.setActive('procedures', [procedure]);

									service.getProcedure(procedure)
										.then((result) => {
											let samplingTime = {
												begin: result.data.outputs[0].constraint.interval[0],
												end: result.data.outputs[0].constraint.interval[1]
											};

											this.updateBoxModel('samplingTime', samplingTime);
											let properties = result.data.outputs.splice(1, result.data.outputs.length - 1);
											this.props.updateProperties(properties)
										})

									this.updateBoxModel('procedure', e.target.value)
								}}>
									{this.generateOptions(this.props.procedures)}
								</select>
							</td>
						</tr>
						<tr>
							<td className="text-right">PROPERTIES:</td>
							<td className="text-left">{this.generateCheckboxes(this.props.properties)}</td>
						</tr>
						</tbody>
					</table>
					</div>
				</div>
				<hr/>
				<div className="row text-center">
					<div className="col-xs-12">
						<h4>WIDGET SETTINGS</h4>
						<span>LAYOUT</span><br/>
						<label className="radio-inline"><input type="radio" name="optradio" value="horizontal" checked={this.state.checkedLayout === 'horizontal'} onChange={this.handleLayout}/>HORIZONTAL</label>
						<label className="radio-inline"><input type="radio" name="optradio" value="vertical" checked={this.state.checkedLayout === 'vertical'} onChange={this.handleLayout}/>VERTICAL</label>
						<table className="table sidebar-table">
							<tbody>
								<tr>
									<td className="text-right">ID:</td>
									<td>
										<input type="text" className="form-control" onChange={(e) => {this.updateBoxModel('id', e.target.value)}}/>
									</td>
								</tr>
								<tr>
									<td className="text-right">CLASS:</td>
									<td>
										<input type="text" className="form-control" onChange={(e) => {this.updateBoxModel('class', e.target.value)}}/>
									</td>
								</tr>
								<tr>
									<td className="text-right">HEIGHT:</td>
									<td>
										<input type="text" className="form-control" onChange={(e) => {this.updateBoxModel('height', e.target.value)}}/>
									</td>
								</tr>
								<tr>
									<td className="text-right">WIDTH:</td>
									<td>
										<input type="text" className="form-control" onChange={(e) => {this.updateBoxModel('width', e.target.value)}}/>
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
  											  onChange={(e) => {this.updateBoxModel('auto_update', e.target.checked)
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
										<select className="form-control" onChange={(e) => {this.updateBoxModel('time_unit', e.target.value)}}>
											<option>Seconds</option>
											<option>Minutes</option>
											<option>Hours</option>
										</select>
									</td>
								</tr>
								<tr>
									<td className="text-right">START DELAY:</td>
									<td>
										<input type="number" min="0" className="form-control" onChange={(e) => {this.updateBoxModel('start_delay', e.target.value)}}/>
									</td>
								</tr>
								<tr>
									<td className="text-right">INTERVAL:</td>
									<td>
										<input type="number" min="0" className="form-control" onChange={(e) => {this.updateBoxModel('interval', e.target.value)}}/>
									</td>
								</tr>
							</tbody>
						</table>
					</div>
				</div>
				<hr/>
				<div className="row text-center home-end">
					<div className="col-xs-12">
						<button className="btn btn-danger" onClick={() => {this.props.generateWidget('box')}}>GENERATE</button>
					</div>
				</div>
			</div>
		)
	}
}

export default SidebarBox;