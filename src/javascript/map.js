goog.provide("istsos.widget.Map");

goog.require("istsos.widget.Widget");

/** istsos.widget.Map class */
/**
 * @constructor
 */
istsos.widget.Map = function () {
    istsos.widget.Widget.call(this);
    this.elementId = null;
    this.layers = [];
    this.map = null;
    this.offering = null;
    this.procedures = [];
    this.observedProperty = null;

    istsos.widget.Widget.prototype.setType.call(this, istsos.widget.TYPE_MAP);

};
goog.inherits(istsos.widget.Map, istsos.widget.Widget);

istsos.widget.Map.prototype = {
    /**
     * INHERITED
     */
    setService: function (serviceName) {
        istsos.widget.Widget.prototype.setService.call(this, serviceName);
    },
    getService: function () {
        return istsos.widget.Widget.prototype.getService.call(this);
    },
    setHeight: function (height) {
        istsos.widget.Widget.prototype.setHeight.call(this, height);
    },
    setWidth: function (width) {
        istsos.widget.Widget.prototype.setWidth.call(this, width);
    },
    setCssClass: function (cssClass) {
        istsos.widget.Widget.prototype.setCssClass.call(this, cssClass);
    },
    getCssClass: function () {
        return istsos.widget.Widget.prototype.getCssClass.call(this);
    },

    /**
     * @param {string} id
     */
    setElementId: function (id) {
        istsos.widget.Widget.prototype.setElementId.call(this, id);
    },
    getElementId: function () {
        istsos.widget.Widget.prototype.getElementId.call(this);
    },
    /** -------------------------------------------------------------- */
    setOffering: function (offering) {
        this.offering = offering;
    },
    getOffering: function () {
        return this.offering;
    },
    /**
     * @param {Array<string>} proceduresList
     */
    setProcedures: function (proceduresList) {
        this.procedures = proceduresList;
    },
    getProcedures: function () {
        return this.procedures;
    },
    /**
     * @param {string} observedProperty
     */
    setObservedProperty: function (observedProperty) {
        this.observedProperty = observedProperty;
    },
    /**
     * @returns {string}
     */
    getObservedProperty: function () {
        return this.observedProperty;
    },
    /**
     * @param {ol.Layer} layer
     */
    addLayer: function (layer) {
        this.layers.push(layer);
    },
    /**
     * @returns {ol.Map}
     */
    build: function () {
        // build the ol3 map
        // ...
        this.map = null;
        var preview = document.getElementById('preview');
        if (preview !== null) {
            document.getElementById('preview').innerHTML = "";
        }
        var widget = this;
        var mapWidgetConf = this.getConfig();
        istsos.widget.SERVER_PROMISE.done(function (data) {
            var serverConf = data;
            var db = new istsos.Database(serverConf["db"]["dbname"], serverConf["db"]["host"], serverConf["db"]["user"], serverConf["db"]["password"],
                serverConf["db"]["port"]);
            var server = new istsos.Server(serverConf["name"], serverConf["url"], db);
            var service = new istsos.Service(mapWidgetConf["service"], server);
            var off = new istsos.Offering(mapWidgetConf["offering"], "", true, "", service);
            var op = new istsos.ObservedProperty(service, "", mapWidgetConf["observedProperty"]);
            var className = '.' + widget.getCssClass();
            if (mapWidgetConf["width"].toString().charAt(mapWidgetConf["width"].toString().length - 1) === '%') {
                $(className).css({
                    "height": mapWidgetConf["height"],
                    "width": mapWidgetConf["width"]
                });
            }
            else {
                $(className).css({
                    "height": mapWidgetConf["height"] + 'px',
                    "width": mapWidgetConf["width"] + 'px'
                });
            }
            service.getFeatureCollection(3857, off);

            istsos.once(istsos.events.EventType.GEOJSON, function (evt) {
                //
                var geo = evt.getData();
                var procedureList = mapWidgetConf["procedures"].split(',');
                var procedureConfig = [];

                for (var p = 0; p < procedureList.length; p++) {
                    var obj = {
                        "procedure": "",
                        "uom": "",
                        "type": "",
                        "samplingTime": {"begin": "", "end": ""},
                        "geometry": {},
                        "lastObs": [],
                        "imageSrc": ""
                    };
                    for (var g = 0; g < geo["features"].length; g++) {
                        if (procedureList[p] === geo["features"][g]["properties"]["name"]) {
                            obj["procedure"] = procedureList[p];
                            obj["type"] = geo["features"][g]["properties"]["sensortype"];
                            obj["geometry"]["x"] = geo["features"][g]["geometry"]["coordinates"][0];
                            obj["geometry"]["y"] = geo["features"][g]["geometry"]["coordinates"][1];
                            break;
                        }
                    }
                    procedureConfig.push(obj);
                }
                if (procedureConfig.length === 1) {
                    for (var gs = 0; gs < geo["features"].length; gs++) {
                        if (procedureConfig[0]["procedure"] === geo["features"][gs]["properties"]["name"]) {
                            procedureConfig[0]["samplingTime"]["begin"] = geo["features"][gs]["properties"]["samplingTime"]["beginposition"];
                            procedureConfig[0]["samplingTime"]["end"] = geo["features"][gs]["properties"]["samplingTime"]["endposition"];
                        }
                    }
                } else {
                    for (var pc = 0; pc < procedureConfig.length; pc++) {
                        for (var gc = 0; gc < geo["features"].length; gc++) {
                            if (procedureConfig[pc]["procedure"] === geo["features"][gc]["properties"]["name"]) {
                                if (pc === 0) {
                                    procedureConfig[pc]["samplingTime"]["begin"] = geo["features"][gc]["properties"]["samplingTime"]["beginposition"];
                                    procedureConfig[pc]["samplingTime"]["end"] = geo["features"][gc]["properties"]["samplingTime"]["endposition"];
                                } else {
                                    procedureConfig[pc]["samplingTime"]["begin"] = istsos.widget.olderDate(procedureConfig[pc - 1]["samplingTime"]["begin"], geo["features"][gc]["properties"]["samplingTime"]["beginposition"]);
                                    procedureConfig[pc]["samplingTime"]["end"] = istsos.widget.newerDate(procedureConfig[pc - 1]["samplingTime"]["end"], geo["features"][gc]["properties"]["samplingTime"]["endposition"]);
                                }
                            }
                        }
                    }
                }

                var proc_obs = [];

                for (var c = 0; c < procedureConfig.length; c++) {
                    if (procedureConfig[c]["type"] === "virtual") {
                        proc_obs.push(new istsos.VirtualProcedure(service, procedureConfig[c]["procedure"], "", "", "foi", 3857, 5, 5, 5, [], "virtual", "", "", {}));
                    } else {
                        proc_obs.push(new istsos.Procedure(service, procedureConfig[c]["procedure"], "", "", "foi", 3857, 5, 5, 5, [], "insitu-fixed-point", ""));
                    }
                }
                service.getObservations(off, proc_obs, [op], procedureConfig[procedureConfig.length - 1]["samplingTime"]["begin"], procedureConfig[procedureConfig.length - 1]["samplingTime"]["end"]);

                istsos.once(istsos.events.EventType.GETOBSERVATIONS, function (evt) {
                    var observations = evt.getData();
                    var coords;
                    var centerX = 0;
                    var centerY = 0;
                    var sumX = 0;
                    var sumY = 0;
                    var feature_source = new ol.source.Vector({
                        features: []
                    });
                    /*
                    var osm = new ol.layer.Tile({
                        preload: Infinity,
                        source: new ol.source.OSM()
                    });
                    */
                    var osm = new ol.layer.Tile({
                        preload: Infinity,
                        source: new ol.source.OSM({
                            attributions: [
                                new ol.Attribution({
                                    html: 'Tiles courtesy of ' + '<a href="http://hot.openstreetmap.org">' +
                                    'Humanitarian OpenStreetMap Team </a>'
                                }),
                            ol.source.OSM.ATTRIBUTION
                            ],
                            url: 'http://{a-c}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png'
                        })
                    });
                    widget.addLayer(osm);

                     

                    istsos.widget.OBSERVED_PROPERTIES_PROMISE.done(function (data) {
                        var values;
                        for (var c = 0; c < procedureConfig.length; c++) {
                            for (var o = 0; o < observations.length; o++) {
                                values = observations[o]["result"]["DataArray"]["values"];
                                if (procedureConfig[c]["procedure"] === observations[o]["name"]) {
                                    procedureConfig[c]["uom"] = observations[0]["result"]["DataArray"]["field"][1]["uom"];
                                    procedureConfig[c]["lastObs"].push(moment(values[values.length - 1][0]).utc().format());
                                    procedureConfig[c]["lastObs"].push(values[values.length - 1][1]);
                                    for (var i = 0; i < data[widget.getObservedProperty()].length; i++) {
                                        if (procedureConfig[c]["lastObs"][1] >= data[widget.getObservedProperty()][i]["from"] && procedureConfig[c]["lastObs"][1] < data[widget.getObservedProperty()][i]["to"]) {
                                            procedureConfig[c]["imageSrc"] = data[widget.getObservedProperty()][i]["url"];
                                        }
                                    }
                                    coords = [procedureConfig[c]["geometry"]["x"], procedureConfig[c]["geometry"]["y"]];
                                    sumX += procedureConfig[c]["geometry"]["x"];
                                    sumY += procedureConfig[c]["geometry"]["y"];
                                    var feature = new ol.Feature({
                                        geometry: new ol.geom.Point(coords),
                                        name: procedureConfig[c]["procedure"] + '\n\n\n\n\n\n' + parseFloat(procedureConfig[c]["lastObs"][1]).toFixed(2).toString() + procedureConfig[c]["uom"] + '\n' + 'DATE: ' + procedureConfig[c]["lastObs"][0].slice(0, 10) +
                                        '\n' + 'TIME: ' + procedureConfig[c]["lastObs"][0].slice(11, 19) + ' (UTC)' + '&&' + procedureConfig[c]["imageSrc"]
                                    });
                                    feature_source.addFeature(feature);
                                }
                            }
                        }
                        centerX = sumX / procedureConfig.length;
                        centerY = sumY / procedureConfig.length;
                        var cluster_source = new ol.source.Cluster({
                            distance: 150,
                            source: feature_source
                        });

                        var styleCache = {}
                        var feature_layer = new ol.layer.Vector({
                            source: cluster_source,
                            style: function (feature) {
                                if (feature.get('features').length != 1) {
                                    var size = feature.get('features').length;
                                    var style = styleCache[size];
                                    var text = "";
                                    var offsetY = 34;
                                    feature.get('features').forEach(function (f) {
                                        text += f.getProperties()["name"].split('\n\n\n\n\n')[0] + '\n';
                                        if(feature.get('features').indexOf(f) > 1) {
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


                        widget.addLayer(feature_layer);

                        widget.map = new ol.Map({
                            target: mapWidgetConf["elementId"],
                            layers: [],
                            view: new ol.View({
                                center: [centerX, centerY]
                            })
                        });
                        widget.map.addLayer(osm);
                        widget.map.addLayer(feature_layer);
                        if (procedureConfig.length > 1) {
                            widget.map.getView().fit(feature_source.getExtent(), widget.map.getSize());
                            var z = widget.map.getView().getZoom();
                            widget.map.getView().setZoom(z - 0.5);
                        } else {
                            widget.map.getView().setZoom(15);
                        }


                    });
                });
            });
        });


    },
    getConfig: function () {
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
            "cssClass": this.cssClass
        };
    }
};


