import React, {Component} from 'react';

class SidebarMap extends Component {
	constructor(props) {
		super(props)
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
								<select className="form-control">
									<option>-- Select service from the list --</option>
								</select>
							</td>
						</tr>
						<tr>
							<td className="text-right">OFFERING:</td>
							<td>
								<select className="form-control">
									<option>-- Select offering from the list --</option>
								</select>
							</td>
						</tr>
						<tr>
							<td className="text-right">PROCEDURES:</td>
							<td></td>
						</tr>
						<tr>
							<td className="text-right">PROPERTY:</td>
							<td>
								<select className="form-control">
									<option>-- Select observed property from the list --</option>
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
										<input type="text" className="form-control"/>
									</td>
								</tr>
								<tr>
									<td className="text-right">CLASS:</td>
									<td>
										<input type="text" className="form-control"/>
									</td>
								</tr>
								<tr>
									<td className="text-right">HEIGHT:</td>
									<td>
										<input type="text" className="form-control"/>
									</td>
								</tr>
								<tr>
									<td className="text-right">WIDTH:</td>
									<td>
										<input type="text" className="form-control"/>
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
  							<label><input type="checkbox" value=""/>ON/OFF</label>
						</div>
						<table className="table sidebar-table">
							<tbody>
								<tr>
									<td className="text-right">TIME UNIT:</td>
									<td>
										<select className="form-control">
											<option>Seconds</option>
											<option>Minutes</option>
											<option>Hours</option>
										</select>
									</td>
								</tr>
								<tr>
									<td className="text-right">START DELAY:</td>
									<td>
										<input type="text" className="form-control"/>
									</td>
								</tr>
								<tr>
									<td className="text-right">INTERVAL:</td>
									<td>
										<input type="text" className="form-control"/>
									</td>
								</tr>
							</tbody>
						</table>
					</div>
				</div>
				<hr/>
				<div className="row text-center home-end">
					<div className="col-xs-12">
						<button className="btn btn-danger">GENERATE</button>
					</div>
				</div>
			</div>
		)
	}
}

export default SidebarMap;