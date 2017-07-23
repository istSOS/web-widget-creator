import React from 'react';

const Home = (props) => {
	return (
		<div className="home container">
			<div className="row heading">
				<div className="col-xs-12">
					<h1>IstSOS Web Widget Creator</h1>
					<h3 className="text-center">Create customized embeddable widgets (maps, boxes, charts), that contain observation data from the IstSOS server</h3>
				</div>
			</div>
			<hr/>
			<div className="row text-left">
				<div className="col-xs-12">
					<h4>1. Users have a possibility to generate next types of widgets:</h4>
				</div>
			</div>
			<div className="row text-left home-widget">
				<h5>&nbsp;&nbsp;&nbsp;Map</h5>
				<div className="col-xs-12 col-sm-6 col-md-9 home-widget-description">
					<p>
						Map widget shows location of one or more selected sensors on the map. User is offered to customize
						size of the map, to select what sensors to show, what observed property should be targeted for observation etc...
						Also there is a possibility to show custom icons for the sensors, but it requires users to populate observed property specification JSON, with icon URLs
						and corresponding intervals.
					</p>
				</div>
				<div className="col-xs-12 col-sm-6 col-md-3 home-img">
					<img className="img-thumbnail" src="https://wiki.osgeo.org/images/3/34/Map-ISTSOS.png"/>
				</div>
			</div>
			<hr/>
			<div className="row text-left home-widget">
				<h5>&nbsp;&nbsp;&nbsp;Box</h5>
				<div className="col-xs-12 col-sm-6 col-md-9 home-widget-description">
					<p>
						Box widget shows the last observation data of the single sensor, where the user can choose multiple observed properties.
					</p>
				</div>
				<div className="col-xs-12 col-sm-6 col-md-3 home-img">
					<img className="img-thumbnail" src="https://wiki.osgeo.org/images/2/2b/Box.png"/>
				</div>
			</div>
			<hr/>
			<div className="row text-left home-widget">
				<h5>&nbsp;&nbsp;&nbsp;Chart</h5>
				<div className="col-xs-12 col-sm-6 col-md-9 home-widget-description">
					<p>
						Chart widget shows observation data using different types of charts.  User is offered to customize, which sensors and observed properties to consider and what type 
						of a chart to use for visualization of the data.
					</p>
				</div>
				<div className="col-xs-12 col-sm-6 col-md-3 home-img">
					<img className="img-thumbnail" src="https://wiki.osgeo.org/images/e/e8/Chart.png"/>
				</div>
			</div>
			<hr/>
			<div className="row text-left">
				<div className="col-xs-12">
					<h4>2. Output results:</h4>
				</div>
			</div>
			<div className="row text-left home-widget home-end">
				<div className="col-xs-12 col-sm-12 home-widget-description">
					<p>
						As an output result, users get preview of the generated widget and the code, that can be used to embed widget into other websites.
					</p>
				</div>
				<div className="col-xs-12 col-sm-6">
					<p>Picture goes here!!!</p>
				</div>
				<div className="col-xs-12 col-sm-6">
					<p>Picture goes here!!!</p>
				</div>
			</div>
		</div>
	)
}

export default Home;