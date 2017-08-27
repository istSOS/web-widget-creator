import React, {Component} from 'react';

class BoxWidget extends Component {
	constructor(props) {
		super(props);
	}

	generateItems(properties) {
		return properties.map((prop, i) => {
			return (
			<div key={i} className="col-xs-12 col-sm-6 col-md-4 col-lg-4" style={{padding: "5px"}}>
			   <img style={{maxWidth: "100px", maxHeight: "100px"}} src="http://static.renishaw.com/media/thumbnails/240high/7c748c7af2984880b33363a275565bad.jpg"/>
			   <table>
			   	<tbody>
				      <tr>
				        <td>{prop.display}:</td>
				        <td>&nbsp;&nbsp;<i>{prop.value} {prop.uom}</i></td>
				      </tr>
			      </tbody>
			   </table>
			</div>
			)

		})
	}

	render() {
		console.log(this.props.preview)
		let data = {
			name: this.props.preview.procedure,
			date: this.props.preview.dataConfig[this.props.preview.procedure].lastObservation.date.slice(0,10),
			time: this.props.preview.dataConfig[this.props.preview.procedure].lastObservation.date.slice(11, 19),
			gmt: this.props.preview.dataConfig[this.props.preview.procedure].lastObservation.date.slice(19,22),

		}
		return (
			<div className="container text-center" style={{maxWidth: "600px"}}>
			  <div className="row" style={{background: "green", color: "white", padding: "5px"}}>
			    <div className="col-sm-3 text-center"><i><strong>{data.name}</strong></i></div>
			    <div className="col-sm-3 text-center"><i>DATE: {data.date}</i></div>
			    <div className="col-sm-3 text-center"><i>TIME: {data.time}</i></div>
			    <div className="col-sm-3 text-center"><i>GMT: {data.gmt}</i></div>
			  </div>
			  <div className="row">
			  	 {this.generateItems(this.props.preview.dataConfig[this.props.preview.procedure].observedSpec)} 
			  </div>
			</div>
		)
	}
}

export default BoxWidget;