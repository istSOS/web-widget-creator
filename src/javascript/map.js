goog.provide("istsos.widget.Map");

goog.require("istsos.widget.Widget");

/** istsos.widget.Map class */
/**
 * @constructor
 */
istsos.widget.Map = function() {
    istsos.widget.Widget.call(this);
    this.layers = [];
    this.map = null;
    this.offering = null;
    this.procedures = [];
    this.observedProperty = null;
    this.dataConfig = {};
    this.autoUpdate = {};

    istsos.widget.Widget.prototype.setType.call(this, istsos.widget.TYPE_MAP);

};
goog.inherits(istsos.widget.Map, istsos.widget.Widget);

istsos.widget.Map.prototype = {
    /**
    * @param {String} offering
    */
    setOffering: function(offering) {
        this.offering = offering;
    },
    /**
     * @returns {string}
     */
    getOffering: function() {
        return this.offering;
    },
    /**
     * @param {Array<string>} proceduresList
     */
    setProcedures: function(proceduresList) {
        this.procedures = proceduresList;
    },
    /**
     * @returns {Array<String>}
     */
    getProcedures: function() {
        return this.procedures;
    },
    /**
     * @param {String} observedProperty
     */
    setObservedProperty: function(observedProperty) {
        this.observedProperty = observedProperty;
    },
    /**
     * @returns {String}
     */
    getObservedProperty: function() {
        return this.observedProperty;
    },
    /**
     * @param {ol.Layer} layer
     */
    addLayer: function(layer) {
        this.layers.push(layer);
    },
    /**
     * @param {Array<ol.Layer>} layers
     */
    setLayers: function(layers) {
        this.layers = layers;
    },
    /**
     * @returns {Array<ol.Layer>}
     */
    getLayers: function() {
        return this.layers;
    },
    /**
     * @param {JSON} dataConfig
     */
    setDataConfig: function(dataConfig) {
        this.dataConfig = dataConfig;
    },
    /**
     * @returns {JSON}
     */
    getDataConfig: function() {
        return this.dataConfig;
    },
    /**
     * @param {ol.Map} map
     */
    setMap: function(map) {
        this.map = map;
    },
    /**
     * @returns {ol.Map}
     */
    getMap: function() {
        return this.map;
    },
    /**
     * @param {JSON} autoUpdateObj
     */
    setAutoUpdate: function(autoUpdateObj) {
        this.autoUpdate = autoUpdateObj;
    },
    /**
     * @returns {JSON}
     */
    getAutoUpdate: function() {
        return this.autoUpdate;
    },
    
    //INHERITED FROM istsos.widget.Widget CLASS
    /**
     * @param {String} serviceName
     */
    setService: function(serviceName) {
        istsos.widget.Widget.prototype.setService.call(this, serviceName);
    },
    /**
     * @returns {String}
     */
    getService: function() {
        return istsos.widget.Widget.prototype.getService.call(this);
    },
    /**
     * @param {String} height
     */
    setHeight: function(height) {
        istsos.widget.Widget.prototype.setHeight.call(this, height);
    },
    /**
     * @returns {String}
     */
    getHeight: function() {
        return istsos.widget.Widget.prototype.getHeight.call(this);
    },
    /**
     * @param {String} width
     */
    setWidth: function(width) {
        istsos.widget.Widget.prototype.setWidth.call(this, width);
    },
    /**
     * @returns {String}
     */
    getWidth: function() {
        return istsos.widget.Widget.prototype.getWidth.call(this);
    },
    /**
     * @param {String} cssClass
     */
    setCssClass: function(cssClass) {
        istsos.widget.Widget.prototype.setCssClass.call(this, cssClass);
    },
    /**
     * @returns {String}
     */
    getCssClass: function() {
        return istsos.widget.Widget.prototype.getCssClass.call(this);
    },
    /**
     * @param {String} type
     */
    setType: function(type) {
        this.type = istsos.widget.Widget.prototype.setType.call(this, type);
    },
    /**
     * @returns {String}
     */
    getType: function() {
        return istsos.widget.Widget.prototype.getType.call(this);
    },
    /**
     * @param {string} id
     */
    setElementId: function(id) {
        istsos.widget.Widget.prototype.setElementId.call(this, id);
    },
    /**
     * @returns {String}
     */
    getElementId: function() {
        return istsos.widget.Widget.prototype.getElementId.call(this);
    },

    //METHOD FOR BUILDING THE MAP WIDGET
    /**
     * @returns {istsos.widget.Map}
     */
    build: function() {
        var data = this.getDataConfig();

        //SETTING CSS WIDTH AND HEIGHT OF THE MAP
        if(document.getElementById('preview') !== null) {
            document.getElementsByClassName(this.getCssClass())[0].style.height = this.getHeight();
            document.getElementsByClassName(this.getCssClass())[0].style.width = this.getWidth();
        } else {
            var elementList = document.getElementsByClassName(this.getCssClass());
            var height = this.getHeight() + "px";
            var width = this.getWidth() + "px";
            for(var el = 0; el < elementList.length; el++) {
                elementList[el].style.width = width;
                elementList[el].style.height = height;
            }
        }
        
        //SOURCE CONTAINER OF SENSORS AS OL FEATURES
        var feature_source = new ol.source.Vector({
            features: []
        });

        //ENABLING CLUSTERING FUNCTIONALITY BY ADDING THE CLUSTER SOURCE
        var cluster_source = new ol.source.Cluster({
            distance: 150,
            source: feature_source
        });

        //ADDING SENSOR FEATURES TO THE SOURCE
        data["data"].forEach(function(p) {
            var feature = new ol.Feature({
                geometry: new ol.geom.Point(ol.proj.transform(p["coords"], "EPSG:4326", "EPSG:3857")),
                name: p["name"] + '\n\n\n\n\n\n' + parseFloat(p["lastObs"]).toFixed(2).toString() + data["property"]["uom"] + '\n' + 'DATE: ' + p["lastDate"].slice(0, 10) +
                    '\n' + 'TIME: ' + p["lastDate"].slice(11, 19) + ' (UTC)' + '&&' + p["imageSrc"]
            });
            feature_source.addFeature(feature);
        });

        //BASE LAYER - OSM
        var osm = new ol.layer.Tile({
            preload: Infinity,
            source: new ol.source.OSM()
        });

        //SENSOR FEATURE LAYER
        var styleCache = {}
        var feature_layer = new ol.layer.Vector({
            source: cluster_source,
            style: function(feature) {

                //IF THERE ARE NO CLUSTERS, USE GENERAL STYLE
                if (feature.get('features').length != 1) {
                    var size = feature.get('features').length;
                    var style = styleCache[size];
                    var text = "";
                    var offsetY = 34;
                    feature.get('features').forEach(function(f) {
                        text += f.getProperties()["name"].split('\n\n\n\n\n')[0] + '\n';
                        if (feature.get('features').indexOf(f) > 1) {
                            offsetY += 8;
                        }
                    });
                    if (!style) {
                        style = new ol.style.Style({
                            image: new ol.style.Circle({
                                radius: 16,
                                stroke: new ol.style.Stroke({
                                    color: '#ea5252'
                                }),
                                fill: new ol.style.Fill({
                                    color: '#ea5252'
                                })
                            }),
                            text: new ol.style.Text({
                                text: size.toString() + '\n\n' + text,
                                fill: new ol.style.Fill({
                                    color: 'white'
                                }),
                                stroke: new ol.style.Stroke({
                                    width: 3,
                                    color: 'black'
                                }),
                                font: '13px sans-serif',
                                offsetY: offsetY
                            })
                        });
                        styleCache[size] = style;
                    }
                    return style;

                //IF CLUSTERED, USE CLUSTER SPECIFIC STYLE
                } else {
                    var textSplit = feature.get('features')[0].getProperties()["name"].split('&&');
                    var style = new ol.style.Style({
                        image: new ol.style.Icon({
                            anchor: [0.5, 0.5],
                            offset: [0, 0],
                            opacity: 1,
                            scale: 0.25,
                            src: textSplit[1]
                        }),
                        text: new ol.style.Text({
                            text: textSplit[0],
                            fill: new ol.style.Fill({
                                color: 'white'
                            }),
                            stroke: new ol.style.Stroke({
                                width: 3,
                                color: 'black'
                            }),
                            font: '13px sans-serif',
                            offsetY: 20,
                            offsetX: -30,
                            textAlign: 'left'
                        })
                    });
                    return style;
                }
            }
        });

        //ADDING LAYERS TO THE WIDGET INSTANCE
        this.addLayer(osm);
        this.addLayer(feature_layer);
        
        //CREATING A MAP
        var target = this.getElementId();
        var layers = this.getLayers();
        this.map = new ol.Map({
            target: target
        });
        this.map.addLayer(layers[0]);
        this.map.addLayer(layers[1]);

        //SETTING UP THE MAP VIEW - CENTER AND ZOOM
        if (data["data"].length > 1) {
            this.map.getView().fit(feature_source.getExtent(), this.map.getSize());
            var z = this.map.getView().getZoom();
            this.map.getView().setZoom(z - 0.5);
        } else {
            this.map.getView().fit(feature_source.getExtent(), this.map.getSize());
            this.map.getView().setZoom(15);
        }

        //DATA UPDATE (OBSERVATION, LAST DATE)
        if(document.getElementById('preview') === null) {          
            var widget = this;
            var updt = widget.getAutoUpdate();
            
            //DEFINING A MULTIPLIER, BASED ON SELECTED TIME UNIT
            if(updt["checked"]) {
                var multiplier;
                switch(updt["unit"]) {
                    case "sec":
                        multiplier = 1000;
                        break;
                    case "min":
                        multiplier = 60000;
                        break;
                    case "hr":
                        multiplier = 3600000;
                        break;
                    default:
                        multiplier = 1000;
                        console.log("Multiplier set to 1000");
                        break;
                }

                //CALLING THE UPDATE FUNCTION
                setTimeout(function(){ 
                    istsos.widget.updateData(widget);
                    setInterval(function() {
                        istsos.widget.updateData(widget);
                    }, updt["interval"] * multiplier) 
                }, updt["delay"] * multiplier);
            }           
        }
        return this;
    },
    /**
    * returns {JSON}
    */
    getConfig: function() {
        return {
            "service": this.service,
            "elementId": this.elementId,
            "type": this.type,
            "offering": this.offering,
            "procedures": this.procedures,
            "observedProperty": this.observedProperty,
            "layers": this.layers,
            "width": this.width,
            "height": this.height,
            "cssClass": this.cssClass,
            "dataConfig": this.dataConfig,
            "autoUpdate": this.autoUpdate
        };
    }
};