import {Widget} from 'Widget';
import TYPES from 'WidgetTypes';
import {
   Map as olMap,
   layer as olLayer,
   View as olView,
   source as olSource,
   proj as olProj,
   style as olStyle,
   Feature as olFeature,
   geom as olGeom
} from 'openlayers';

export const Map = class Map extends Widget {
   constructor(options) {
      super(options);
      this.offering = options.offering || null;
      this.procedures = options.procedures || [];
      this.observedProperty = options.observedProperty || null;
      this.dataConfig = options.dataConfig || null;
      this.autoUpdate = {
         active: options.auto_update,
         time_unit: options.time_unit || null,
         start_delay: options.start_delay || null,
         interval: options.interval || null
      };
      super.setType(TYPES.TYPE_MAP);


      this.build = this.build.bind(this);
   }

   /**
    * @param {String} offering
    */
   setOffering(offering) {
      this.offering = offering;
   }

   /**
    * @returns {string}
    */
   getOffering() {
      return this.offering;
   }

   /**
    * @param {Array<string>} proceduresList
    */
   setProcedures(proceduresList) {
      this.procedures = proceduresList;
   }

   /**
    * @returns {Array<String>}
    */
   getProcedures() {
      return this.procedures;
   }

   /**
    * @param {String} observedProperty
    */
   setObservedProperty(observedProperty) {
      this.observedProperty = observedProperty;
   }

   /**
    * @returns {String}
    */
   getObservedProperty() {
      return this.observedProperty;
   }

   /**
    * @param {ol.Layer} layer
    */
   addLayer(layer) {
      this.layers.push(layer);
   }

   /**
    * @param {Array<ol.Layer>} layers
    */
   setLayers(layers) {
      this.layers = layers;
   }

   /**
    * @returns {Array<ol.Layer>}
    */
   getLayers() {
      return this.layers;
   }

   /**
    * @param {JSON} dataConfig
    */
   setDataConfig(dataConfig) {
      this.dataConfig = dataConfig;
   }

   /**
    * @returns {JSON}
    */
   getDataConfig() {
      return this.dataConfig;
   }

   /**
    * @param {ol.Map} map
    */
   setMap(map) {
      this.map = map;
   }

   /**
    * @returns {ol.Map}
    */
   getMap() {
      return this.map;
   }

   /**
    * @param {JSON} autoUpdateObj
    */
   setAutoUpdate(autoUpdateObj) {
      this.autoUpdate = autoUpdateObj;
   }

   /**
    * @returns {JSON}
    */
   getAutoUpdate() {
      return this.autoUpdate;
   }


   //INHERITED FROM istsos.widget.Widget CLASS
   /**
    * @param {String} serviceName
    */
   setService(serviceName) {
      super.setService(serviceName);
   }

   /**
    * @returns {String}
    */
   getService() {
      return super.getService();
   }

   /**
    * @param {String} height
    */
   setHeight(height) {
      super.setHeight(height);
   }

   /**
    * @returns {String}
    */
   getHeight() {
      return super.getHeight();
   }

   /**
    * @param {String} width
    */
   setWidth(width) {
      super.setWidth(width);
   }

   /**
    * @returns {String}
    */
   getWidth() {
      return super.getWidth();
   }

   /**
    * @param {String} cssClass
    */
   setCssClass(cssClass) {
      super.setCssClass(cssClass);
   }

   /**
    * @returns {String}
    */
   getCssClass() {
      return super.getCssClass();
   }

   /**
    * @param {String} type
    */
   setType(type) {
      this.type = super.setType(type);
   }

   /**
    * @returns {String}
    */
   getType() {
      return super.getType();
   }

   /**
    * @param {string} id
    */
   setElementId(id) {
      super.setElementId(id);
   }

   /**
    * @returns {String}
    */
   getElementId() {
      return super.getElementId();
   }

   /**
    * @returns {String}
    */
   getConfig() {
      return {
         "service": this.service,
         "elementId": this.elementId,
         "type": this.type,
         "offering": this.offering,
         "procedures": this.procedures,
         "observedProperty": this.observedProperty,
         "width": this.width,
         "height": this.height,
         "cssClass": this.cssClass,
         "dataConfig": this.dataConfig,
         "autoUpdate": this.autoUpdate
      };
   }

   build() {
      let element = document.getElementById(this.getElementId());

      if(this.getElementId() != "preview") {
         element.className = this.getCssClass();

         element.style.height = (this.height.slice(0, this.width.length-3) == "px") ? this.height : this.height + "px";
         element.style.width = (this.width.slice(0, this.width.length-3) == "px") ? this.width : this.width + "px";
      }


      let feature_source = new olSource.Vector({
         features: []
      });

      for (let sensor in this.dataConfig) {
         if(sensor != 'library_path') {
            let feature = new olFeature({
               geometry: new olGeom.Point(olProj.transform(this.dataConfig[sensor].coordinates, 'EPSG:4326', 'EPSG:3857'))
            });

            feature.setProperties({
               name: sensor,
               iconURL: "http://www.quicklogic.com/assets/Uploads/al3s2/sensor-icon-temp.png",
               date: this.dataConfig[sensor].lastObservation.date,
               value: this.dataConfig[sensor].lastObservation.value,
               uom: this.dataConfig[sensor].observedSpec.uom
            });
            feature_source.addFeature(feature);
         }
      }

      let cluster_source = new olSource.Vector({
         distance: 150,
         source: feature_source
      });

      let that = this;

      let layers = [
         new olLayer.Tile({
            source: new olSource.OSM()
         }),
         new olLayer.Vector({
            source: feature_source,
            style: (feature) => {
               let style = new olStyle.Style({
                  image: new olStyle.Circle({
                     radius: 10,
                     stroke: new olStyle.Stroke({
                        color: '#fff'
                     }),
                     fill: new olStyle.Fill({
                        color: '#3399CC'
                     })
                  }),
                  text: new olStyle.Text({
                     text: `${feature.get('name')}\n${feature.get('value')} ${feature.get('uom')}\n${feature.get('date')}`,
                        fill: new olStyle.Fill({
                        color: 'white'
                     }),
                     stroke: new olStyle.Stroke({
                        width: 3,
                        color: 'black'
                     }),
                     font: '13px sans-serif',
                     offsetY: 34
                  })
               });

               return style;
            }
         })
      ];

      let map = new olMap({
         target: this.getElementId(),
         loadTilesWhileInteracting: true,
         loadTilesWhileAnimating: true,
         layers: layers,
         view: new olView({
            center: olProj.transform([22, 44], 'EPSG:4326', 'EPSG:3857'),
            zoom: 6
         })

      })

      return this;
   }

};