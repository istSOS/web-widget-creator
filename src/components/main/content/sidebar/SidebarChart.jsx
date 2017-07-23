import React, {Component} from 'react';

class SidebarChart extends Component {
	constructor(props) {
		super(props)
	}

	render() {
		return (
			(
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
							<td className="text-right">PROPERTIES:</td>
							<td></td>
						</tr>
						</tbody>
					</table>
					</div>
				</div>
				<hr/>
				<div className="row text-center">
					<div className="col-xs-12">
						<h4>TIME SPAN:</h4>
						<table className="table sidebar-table">
							<tbody>
								<tr>
									<td className="text-right">FROM:</td>
									<td>
										<input type="text" className="form-control"/>
									</td>
								</tr>
								<tr>
									<td className="text-right">TO:</td>
									<td>
										<input type="text" className="form-control"/>
									</td>
								</tr>
								<tr>
									<td className="text-right">GMT:</td>
									<td>
										<select className="form-control">
											<option>-- Select time zone offset --</option>
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
						<h4>CHART SETTINGS:</h4>
						<table className="table sidebar-table">
							<tbody>
								<tr>
									<td className="text-right">TYPE:</td>
									<td>
										<select className="form-control">
											<option>Line</option>
											<option>Overview detail</option>
											<option>Multivariable</option>
											<option>Histogram</option>
										</select>
									</td>
								</tr>
								<tr>
									<td className="text-right">AGGREGATE INTERVAL:</td>
									<td>
										<input type="text" className="form-control"/>
									</td>
								</tr>
								<tr>
									<td className="text-right">AGGREGATE FUNCTION:</td>
									<td>
										<input type="text" className="form-control"/>
									</td>
								</tr>
								<tr>
									<td className="text-right">COLOR:</td>
									<td>
										<input type="text" className="form-control"/>
									</td>
								</tr>
								<tr>
									<td className="text-right">COLOR 2:</td>
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
				<div className="row text-center home-end">
					<div className="col-xs-12">
						<button className="btn btn-danger">GENERATE</button>
					</div>
				</div>
			</div>
		)
		)
	}
}

export default SidebarChart;