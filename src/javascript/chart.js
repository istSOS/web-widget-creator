goog.provide("istsos.widget.Chart");

goog.require("istsos.widget.Widget");

/** istsos.widget.Map class */
/**
 * @constructor
 */
istsos.widget.Chart = function() {
    istsos.widget.Widget.call(this);
    this.chart = null;
    this.offering = null;
    this.procedures = [];
    this.observedProperties = [];
    this.interval = [];
    this.chartTypeConf = {};

    istsos.widget.Widget.prototype.setType.call(this, istsos.widget.TYPE_CHART);

};
goog.inherits(istsos.widget.Chart, istsos.widget.Widget);

istsos.widget.Chart.prototype = {
	/**
     * INHERITED
     */
    setService: function(serviceName) {
        istsos.widget.Widget.prototype.setService.call(this, serviceName);
    },
    getService: function() {
        return istsos.widget.Widget.prototype.getService.call(this);
    },
    setHeight: function(height) {
        istsos.widget.Widget.prototype.setHeight.call(this, height);
    },
    setWidth: function(width) {
        istsos.widget.Widget.prototype.setWidth.call(this, width);
    },
    setCssClass: function(cssClass) {
        istsos.widget.Widget.prototype.setCssClass.call(this, cssClass);
    },
    getCssClass: function() {
        return istsos.widget.Widget.prototype.getCssClass.call(this);
    },
    getCode: function (conf) {
    	var chartCode = "<script src=\"https://cdnjs.cloudflare.com/ajax/libs/webcomponentsjs/0.7.22/webcomponents.min.js\"></script>\n" +
        " <link rel=\"import\" href=\"http://localhost/html/web-widget-creator/vistsos/src/default-widget.html\" async>\n";
        var code = istsos.widget.getCode(conf);
        return chartCode + code;
    },
    /** -------------------------------------------------------------- */
    setElementId: function(id) {
        this.elementId = id;
    },
    getElementId: function() {
        return this.elementId;
    },
    setOffering: function(offering) {
        this.offering = offering;
    },
    getOffering: function() {
        return this.offering;
    },
    setProcedures: function(proceduresList) {
        this.procedures = proceduresList;
    },
    getProcedures: function() {
        return this.procedures;
    },
    addObservedProperty: function(observedProperty) {
        this.observedProperties.push(observedProperty);
    },
    setObservedProperties: function(observedPropertiesArray) {
        this.observedProperties = observedPropertiesArray;
    },
    getObservedProperties: function() {
        return this.observedProperties;
    },
    setInterval: function(interval) {
        this.interval = interval;
    },
    getInterval: function() {
        return this.interval;
    },
    build: function() {
    	//build chart widget
    },
    getConfig: function() {
    	return {
            "service": this.service,
            "elementId": this.elementId,
            "type": this.type,
            "offering": this.offering,
            "procedures": this.procedures,
            "observedProperties": this.observedProperties,
            "interval": this.interval,
            "width": this.width,
            "height": this.height,
            "cssClass": this.cssClass,
            "chartTypeConf": this.chartTypeConf
        };
    }
}