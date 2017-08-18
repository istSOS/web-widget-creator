import React, {Component} from 'react';
import SidebarMap from 'sidebar-map';
import SidebarBox from 'sidebar-box';
import SidebarChart from 'sidebar-chart';
import Display from 'display';
import istsos from 'istsos-javascript-core';
import {Map} from 'istsos-widget';

class Tool extends Component {
   constructor(props) {
      super(props);

      this.state = {
      	config: {},
         observedPropertyMap: null,
      	services: [],
      	offerings: [],
      	procedures: [],
         samplingTime: {},
      	properties: [],
         allProperties: {},
         mapModel: {
            service: "",
            offering: "",
            procedures: [],
            samplingTime: {},
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
      this.initProperty = this.initProperty.bind(this);
      this.initSamplingTime = this.initSamplingTime.bind(this);
      this.changeTab = this.changeTab.bind(this);
      this.getItemByName = this.getItemByName.bind(this);
      this.populateOfferings = this.populateOfferings.bind(this);
      this.populateProcedures = this.populateProcedures.bind(this);
      this.populateProperties = this.populateProperties.bind(this);
      this.generateWidget = this.generateWidget.bind(this);
      this.filterPropertiesByProcedures = this.filterPropertiesByProcedures.bind(this);
   }

   componentDidMount() {
      fetch('./spec/server_config.json', {
         method: "get",
      }).then((result) => {
            result.json().then((json) => {
               const db = new istsos.Database(json.db);

               const server = new istsos.Server({
                  name: json.name,
                  url: json.url,
                  defaultDb: db
               });

               this.setState({config: {
                  db: db,
                  server: server
               }});

               server.getServices()
                  .then((result) => {
                     let services = result.data.map((s) => {
                        const service = new istsos.Service({
                           name: s.service,
                           opt_db: this.state.config.db,
                           server: this.state.config.server
                        });
                        return service;
                     })
                     this.setState({services: services})
                  })
            })
         })
      fetch('./spec/observed_properties.json', {
         method: "get",
      }).then((result) => {
         result.json().then((json) => {
            this.setState({observedPropertyMap: json});
         })
      })

   }

	changeTab(tab) {
		this.setState({active: tab});
	}

   initProperty(procedure) {
      let list = [];
      let properties = this.state.allProperties; 
      properties[procedure.name] = []
      procedure.observedproperties.forEach((property) => {
         let prop = new istsos.ObservedProperty({
            observedName: property.name,
            definitionUrn: this.state.observedPropertyMap[property.name].urn,
            active: true,
            service: this.state.mapModel.service,
            constraintType: 'lessThan',
            value: 1000
         });
         properties[procedure.name].push(prop);
         list.push(prop)
      }) 

      this.setState({allProperties: properties})
   }

   initSamplingTime(data) {
      this.setState({samplingTime: data})
   }

   getItemByName(name, type) {
      switch(type) {
         case 'service':
            for (let i = 0; i < this.state.services.length; i++) {
               if(this.state.services[i].name == name) {    
                  return this.state.services[i];
               }
            }
            break;
         case 'offering':
            for (let i = 0; i < this.state.offerings.length; i++) {
               if(this.state.offerings[i].offeringName == name) {    
                  return this.state.offerings[i];
               }
            }
            break;
         case 'procedure':
            for (let i = 0; i < this.state.procedures.length; i++) {
               if(this.state.procedures[i].name == name) {    
                  return this.state.procedures[i];
               }
            }
            break;
         case 'property':
            for (let i = 0; i < this.state.properties.length; i++) {
               if(this.state.properties[i].observedName == name) {    
                  return this.state.properties[i];
               }
            }
            break;
         default:
            break;
      }
   }

	populateOfferings(data) {
		let list = data.map((o) => {
         let offering = new istsos.Offering({
            offeringName: o.name,
            service: this.state.mapModel.service
         })
			return offering
		})
		this.setState({offerings: list})
	}

   populateProcedures(data) {
      let samplingTime = {};
      let list = data.map((o) => {
         let procedure = new istsos.Procedure({
            name: o.name,
            outputs: [],
            service: this.state.mapModel.service,
            epsg: 3857,
            x: 22,
            y: 22,
            z: 33,
            foi_name: 'test',
            systemType: 'insitu-fixed-point'
         });
         return procedure
      })

      this.setState({procedures: list})
   }

   populateProperties(data) {
      let list = data.map((o) => {
         let property = new istsos.ObservedProperty({
            observedName: o.name,
            service: this.state.mapModel.service,
            constraintType: 'lessThan',
            value: 1000
         })
         return property;
      })
      this.setState({properties: list})
   }

   getIntersection(first, second) {
      let intersection = new Set(first).inter
      return intersection;
   }

   filterPropertiesByProcedures(procedures) {
      // JEDAN SENSOR
      let props = [];
      let all = [];
      procedures.forEach((p) => {
         let lst = []
         this.state.allProperties[p.name].forEach((p1) => {
            lst.push(p1.observedName)
            all.push(p1)
         })
         props.push(lst);
         
      });

      if(props.length == 1) {
         this.setState({properties: this.state.allProperties[procedures[0].name]})
      }

      if(props.length == 2) {
         let t;
         if(props[1].length > props[0].length) {
            t = props[1];
            props[1] = props[0];
            props[0] = t;
         }

         let prop_names = props[0].filter((p) => {
            return props[1].indexOf(p) > -1;
         });

         let unique = [];

         prop_names.forEach((name) => {
            for(let i=0; i < all.length; i++) {
               if(all[i].observedName == name) {
                  unique.push(all[i]);
                  break;
               }
            }
         })

         this.setState({properties: unique})
      }

      if(props.length > 2) {
         let prop_names = [];
         for(let i = 0; i < props.length - 1; i++) {
            if(props[i+1].length > props[i].length) {
               let t = props[i+1];
               props[i+1] = props[i];
               props[i] = t;
            }
            prop_names = props[i].filter((p) => {
               return props[i+1].indexOf(p) > -1;
            });

         }
         let unique = [];
         prop_names.forEach((name) => {
            for(let i=0; i < all.length; i++) {
               if(all[i].observedName == name) {
                  unique.push(all[i]);
                  break;
               }
            }
         })

         this.setState({properties: unique});
      }
   }

	updateModel(tool, key, value) {
		let model;
      switch(tool) {
			case 'map':
				model = this.state.mapModel;
				model[key] = value;
				this.setState({mapModel: model})
				break;
			case 'box':
            model = this.state.boxModel;
            model[key] = value;
				this.setState({boxModel: model})
				break;
			case 'chart':
            model = this.state.chartModel;
            model[key] = value;
				this.setState({chartModel: model})
				break;
			default: 
				break;
		}
	}

   getObservations(options) {
      return options.service.getObservations({
         offering: options.offering,
         procedures: options.procedures,
         observedProperties: [options.property],
         begin: options.samplingTime.begin,
         end: options.samplingTime.end
      })
   }

   generateWidget(type) {
      let widget;
      switch (type) {
         case 'map':
            this.getObservations(this.state.mapModel)
               .then((result) => {
                  console.log(result.data)
                  //EXTRACT GML
                  //LAST OBSERVATION (DATE, VALUE)
               })
            widget = new Map(this.state.mapModel);
            break;
         case 'box':
            break;
         case 'chart':
            break;
         default:
            break;
      }
   }

	render() {
		let Sidebar;
		switch(this.props.type) {
			case 'map':
				Sidebar = <SidebarMap services={this.state.services} 
											 offerings={this.state.offerings}
											 procedures={this.state.procedures}
											 properties={this.state.properties}
                                  initProperty={this.initProperty}
                                  allProperties={this.state.allProperties}
											 update={this.updateModel} 
											 model={this.state.mapModel}
                                  samplingTime={this.state.samplingTime}
                                  initSamplingTime={this.initSamplingTime}
                                  getItemByName={this.getItemByName}
											 updateOfferings={this.populateOfferings}
                                  updateProcedures={this.populateProcedures}
                                  updateProperties={this.populateProperties}
                                  filterProperties={this.filterPropertiesByProcedures}
											 config={this.state.config}
                                  generateWidget={this.generateWidget}
											 />
				break;
			case 'box':
				Sidebar = <SidebarBox services={this.state.services}
                                  offerings={this.state.offerings}
                                  procedures={this.state.procedures}
                                  properties={this.state.properties}
                                  updateOfferings={this.populateOfferings}
                                  updateProcedures={this.populateProcedures}
                                  updateProperties={this.populateProperties}
                                  update={this.updateModel} 
                                  model={this.state.boxModel}
                                  config={this.state.config}
                                  generateWidget={this.generateWidget}
                                  />
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