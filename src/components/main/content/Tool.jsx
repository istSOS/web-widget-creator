import React, {Component} from 'react';
import SidebarMap from 'sidebar-map';
import SidebarBox from 'sidebar-box';
import SidebarChart from 'sidebar-chart';
import Display from 'display';
import istsos from 'istsos-javascript-core';
import {WidgetFunctions} from 'istsos-widget';
import {WidgetTypes} from 'istsos-widget';

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
         activeSettings: {
            service: null,
            offering: null,
            procedures: [],
            properties: []
         },
         mapModel: {
            service: "",
            offering: "",
            procedures: [],
            property: "",
            samplingTime: {},
            id: "",
            class: "",
            width: "",
            height: "",
            auto_update: false,
            time_unit: "",
            start_delay: 0,
            interval: 0,
            data: {},
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
      this.setActiveObject = this.setActiveObject.bind(this);
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
                  widget_lib: json.widget_lib_path,
                  db: db,
                  server: server
               }});

               server.getServices()
                  .then((result) => {
                     let services = result.data.map((s) => {
                        return s.service;
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

   setActiveObject(key, value) {
      let active = this.state.activeSettings;
      active[key] = value;
      this.setState({active: active});
    }

   initProperty(procedure) {
      let properties = this.state.allProperties; 
      properties[procedure.name] = []
      procedure.observedproperties.forEach((property) => {
         properties[procedure.name].push(property.name);
      }) 
      this.setState({allProperties: properties})
   }

   initSamplingTime(data) {
      this.setState({samplingTime: data})
   }

   getItemByName(name, type) {
      switch(type) {
         case 'service':
            return this.state.services[this.state.services.indexOf(name)]
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
			return o.name
		})
		this.setState({offerings: list})
	}

   populateProcedures(data) {
      let samplingTime = {};
      let list = data.map((o) => {
         return o.name
      })

      this.setState({procedures: list})
   }

   populateProperties(data) {
      let list = data.map((o) => {
         return o.name
      })
      this.setState({properties: list})
   }

   getIntersection(first, second) {
      let intersection = new Set(first).inter
      return intersection;
   }

   filterPropertiesByProcedures(procedures) {
      // JEDAN SENSOR
      let properties = [];
      let all = [];
      procedures.forEach((procedure) => {
         let procedureProperties = []
         this.state.allProperties[procedure].forEach((property) => {
            procedureProperties.push(property)
            all.push(property)
         })
         properties.push(procedureProperties);
         
      });

      if(properties.length == 1) {
         this.setState({properties: this.state.allProperties[procedures[0]]})
      }

      if(properties.length == 2) {
         let t;
         if(properties[1].length > properties[0].length) {
            t = properties[1];
            properties[1] = properties[0];
            properties[0] = t;
         }

         let prop_names = properties[0].filter((p) => {
            return properties[1].indexOf(p) > -1;
         });

         let unique = [];

         prop_names.forEach((name) => {
            for(let i=0; i < all.length; i++) {
               if(all[i] == name) {
                  unique.push(all[i]);
                  break;
               }
            }
         })

         this.setState({properties: unique})
      }

      if(properties.length > 2) {
         let prop_names = [];
         for(let i = 0; i < properties.length - 1; i++) {
            if(properties[i+1].length > properties[i].length) {
               let t = properties[i+1];
               properties[i+1] = properties[i];
               properties[i] = t;
            }
            prop_names = properties[i].filter((p) => {
               return properties[i+1].indexOf(p) > -1;
            });

         }
         let unique = [];
         prop_names.forEach((name) => {
            for(let i=0; i < all.length; i++) {
               if(all[i] == name) {
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
         observedProperties: options.observedProperties,
         begin: options.samplingTime.begin,
         end: options.samplingTime.end
      })
   }

   generateWidget(type) {
      document.getElementById('preview').innerHTML = "";
      let widget;
      switch (type) {
         case 'map':
            let conf = {
               service: this.state.activeSettings.service,
               offering: this.state.activeSettings.offering,
               procedures: this.state.activeSettings.procedures,
               observedProperties: this.state.activeSettings.properties,
               samplingTime: this.state.mapModel.samplingTime
            }

            this.getObservations(conf)
               .then((result) => {
                  let parser = new DOMParser();
                  let serializer = new XMLSerializer();
                  let data = {}
                  result.data.forEach((sensor) => {
                     
                     let gmlParsed = parser.parseFromString(sensor.featureOfInterest.geom, 'text/xml');

                     let coordObj = gmlParsed.childNodes[0].childNodes[1].childNodes[0];
                     let coordinates = serializer.serializeToString(coordObj)
                        .split(',')
                        .slice(0, 2);
                     coordinates.forEach((coordinate, index, array) => {
                        array[index] = parseFloat(coordinate);
                     });

                     data[sensor.name] = {
                        observedSpec: this.state.observedPropertyMap[this.state.activeSettings.properties[0].observedName],
                        coordinates: coordinates,
                        lastObservation: {
                           date: sensor.result.DataArray.values[sensor.result.DataArray.values.length - 1][0],
                           value: sensor.result.DataArray.values[sensor.result.DataArray.values.length - 1][1]
                        }
                     }

                  })
                  data["library_path"] = this.state.config.widget_lib;
                  this.updateModel('map','data', data);
                  this.updateModel('map', 'type', WidgetTypes.TYPE_MAP)
                  let widget_result = WidgetFunctions.build(this.state.mapModel, 'Map');
                  this.setState({code: widget_result.code});
               })
            
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
                                  activeSettings={this.state.activeSettings}
                                  setActive={this.setActiveObject}
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
                                  observedPropertyMap={this.state.observedPropertyMap}
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
						<Display code={this.state.code}/>
					</div>
				</div>
			</div>
		);
	}
}

export default Tool;