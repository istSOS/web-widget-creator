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
    this.procedure = null;
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
    setHeight: function ( height) {
       istsos.widget.Widget.prototype.setHeight.call(this, height);
    },
    setWidth: function(width) {
        istsos.widget.Widget.prototype.setWidth.call(this, width);
    },
    setCssClass: function(cssClass) {
        istsos.widget.Widget.prototype.setCssClass.call(this, cssClass);
    },
    getCssClass: function () {
        return istsos.widget.Widget.prototype.getCssClass.call(this);
    },
    getServerConf: function () {
        return istsos.widget.Widget.prototype.getServerConf.call(this);
    },
    /**
     * @param {string} id
     */
    setElementId: function(id){
        this.elementId = id;
    },
    /**
     * @param {string} procedure
    */
    setProcedure: function(procedure){
        this.procedure = (procedure);
    },
    getProcedure: function(){
        return this.procedure;
    },
    /**
     * @param {string} observedProperty
    */
    setObservedProperty: function(observedProperty){
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
        var widget = this;
        var mapWidgetConf = this.getConfig();
        $.getJSON('specs/server_config.json', function (data) {
            var serverConf = data;
            var db = new istsos.Database(serverConf["db"]["dbname"], serverConf["db"]["host"], serverConf["db"]["user"], serverConf["db"]["password"],
                serverConf["db"]["port"]);
            var server = new istsos.Server(serverConf["name"], serverConf["url"], db);
            var service = new istsos.Service(mapWidgetConf["service"] , server);
            var proc = new istsos.Procedure(service, mapWidgetConf["procedure"], "", "", "", 3857, 5, 5 , 5, [], 'insitu-fixed-point', "");
            var off = new istsos.Offering(mapWidgetConf["procedure"], "", true, "", service);
            var op = new istsos.ObservedProperty(service, "", mapWidgetConf["observedProperty"]);
            var className = '.' + widget.getCssClass();
            if (mapWidgetConf["width"].toString().endsWith('%')) {
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

            service.getFeatureCollection(3857, off, proc);

            istsos.on(istsos.events.EventType.GEOJSON, function (evt) {

                var geo = evt.getData();
                var begin = geo["features"][0]["properties"]["samplingTime"]["beginposition"];
                var end = geo["features"][0]["properties"]["samplingTime"]["endposition"];
                service.getObservationsBySingleProperty(off, proc, op, begin, end );
                var x = geo["features"][0]["geometry"]["coordinates"][0];
                var y = geo["features"][0]["geometry"]["coordinates"][1];
                var coords = [x, y];
                var feature = new ol.Feature({
                    geometry: new ol.geom.Point(coords)
                });

                var feature_source = new ol.source.Vector({
                    features: [feature]
                });

                var feature_layer = new ol.layer.Vector({
                    source: feature_source
                    //styling
                    //...
                });

                widget.addLayer(new ol.layer.Tile({
                    source: new ol.source.OSM()
                }));
                widget.addLayer(feature_layer);
                istsos.on(istsos.events.EventType.GETOBSERVATIONS_BY_PROPERTY, function (e) {
                    var obs = e.getData();
                    var lastObs = obs[obs.length - 1]["measurement"];
                    var lastDate = obs[obs.length - 1]["date"];

                    $.getJSON('specs/observed_property_spec.json', function (data) {
                        var imageSrc = '';
                        var unit = '';
                        var dataUrn = data[mapWidgetConf["observedProperty"]];
                        for(var i = 0; i < dataUrn.length; i++){
                            if(lastObs >= dataUrn[i]["from"] && lastObs < dataUrn[i]["to"]) {
                                imageSrc = dataUrn[i]["url"];
                                unit = dataUrn[i]["unit"];
                            }
                        };
                        feature_layer.setStyle(function () {
                            style = new ol.style.Style({
                                image: new ol.style.Icon({
                                    anchor: [0.5, 0.5],
                                    offset: [0, 0],
                                    opacity: 1,
                                    scale: 0.25 ,
                                    src: imageSrc
                                }),
                                text: new ol.style.Text({
                                    text: widget.getProcedure() + '\n\n\n\n\n\n' + parseFloat(lastObs).toFixed(2).toString() + ' ' + unit + '\n' + 'DATE: ' + lastDate.slice(0,10) +
                                    '\n' + 'TIME: ' + lastDate.slice(11, 19) + '\nGMT: ' + lastDate.slice(19, 22),
                                    fill: new ol.style.Fill({
                                        color: 'black'
                                    }),
                                    font: '12px Montserrat, sans-serif',
                                    offsetY: 25,
                                    offsetX: -30,
                                    textAlign: 'left'
                                })
                            });

                        return style;
                        });
                        var map = new ol.Map({
                            target: mapWidgetConf["elementId"],
                            layers: mapWidgetConf["layers"],
                            view: new ol.View({
                                center: [x,y],
                                zoom: 17
                            })
                        });
                    });
                });







            });
        });




    },
    getConfig: function(){
        return {
            "service": this.service,
            "elementId": this.elementId,
            "type": this.type,
            "procedure": this.procedure,
            "observedProperty": this.observedProperty,
            "layers": this.layers,
            "width": this.width,
            "height": this.height,
            "cssClass": this.cssClass
        };
    }
};


