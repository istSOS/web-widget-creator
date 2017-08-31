import React, {Component} from 'react';
import moment from 'moment';

class BoxWidget extends Component {
	constructor(props) {
		super(props);
	}

   getUrlByValue(value, list) {
      for (let i = 0; i < list.length; i++) {
         if (parseFloat(value) >= list[i].from && value < list[i].to) {
            return list[i].url
         }
      }
   }

	generateItems(values, properties) {
		console.log(properties)
		return properties.map((prop, i) => {
			let imgUrl = (this.getUrlByValue(values[prop.name], prop.intervals) != undefined) ? this.getUrlByValue(values[prop.name], prop.intervals): "https://live.osgeo.org/_images/logo-istsos.png";
			return (
			<div key={i} className="col-xs-12 col-sm-6 col-md-4 col-lg-4" style={{padding: "5px"}}>
			   <img style={{maxWidth: "100px", maxHeight: "100px"}} src={imgUrl}/>
			   <table>
			   	<tbody>
				      <tr>
				        <td>{prop.display}:</td>
				        <td>&nbsp;&nbsp;<i>{parseFloat(values[prop.name]).toFixed(2)} {prop.uom}</i></td>
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
			date: this.props.preview.dataConfig[this.props.preview.procedure].lastObservation.date

		}
		return (
			<div className="container text-center" style={{maxWidth: "600px"}}>
			  <div className="row" style={{background: "green", color: "white", padding: "5px"}}>
			    <div className="col-sm-4 text-center"><i><strong>{data.name}</strong></i></div>
			    <div className="col-sm-4 text-center"><i>DATE: {moment(data.date).format('DD-MM-YYYY')}</i></div>
			    <div className="col-sm-4 text-center"><i>TIME: {moment(data.date).format('HH:mm')}</i></div>
			  </div>
			  <div className="row">
			  	 {this.generateItems(this.props.preview.dataConfig[this.props.preview.procedure].lastObservation.properties, this.props.preview.dataConfig[this.props.preview.procedure].observedSpec)} 
			  </div>
			</div>
		)
	}
}

export default BoxWidget;