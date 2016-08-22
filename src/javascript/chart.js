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
    /**
     * @returns {String}
     */
    getCode: function(conf) {
        var chartCode = "<script src=\"https://cdnjs.cloudflare.com/ajax/libs/webcomponentsjs/0.7.22/webcomponents.min.js\"></script>\n" +
            "<link rel=\"import\" href=\"http://localhost/VistSOS-1/src/default-widget.html\" async>\n";
        var code = istsos.widget.getCode(conf);
        return chartCode + code;
    },
    /** -------------------------------------------------------------- */
    /**
     * @param {istsos.widget.Chart} chart
     */
    setChart: function(chart) {
        this.offering = offering;
    },
    /**
     * @returns {istsos.widget.Chart}
     */
    getChart: function() {
        return this.offering;
    },
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
    addObservedProperty: function(observedProperty) {
        this.observedProperties.push(observedProperty);
    },
    /**
     * @param {Array<String>} observedPropertiesArray
     */
    setObservedProperties: function(observedPropertiesArray) {
        this.observedProperties = observedPropertiesArray;
    },
    /**
     * @returns {Array<String>}
     */
    getObservedProperties: function() {
        return this.observedProperties;
    },
    /**
     * @param {Array<String>} interval
     */
    setInterval: function(interval) {
        this.interval = interval;
    },
    /**
     * @returns {Array<String>}
     */
    getInterval: function() {
        return this.interval;
    },
    /**
     * @param {JSON} chartTypeConf
     */
    setChartTypeConf: function(chartTypeConf) {
        this.chartTypeConf = chartTypeConf;
    },
    /**
     * @returns {JSON}
     */
    getChartTypeConf: function() {
        return this.chartTypeConf;
    },

    //METHOD FOR BUILDING THE CHART WIDGET
    /**
     * @returns {istsos.widget.Map}
     */ 
    build: function() {
        var config = this.getConfig();

        var chart = document.createElement('istsos-chart');
        chart.setAttribute("type", config["type"]);
        chart.setAttribute("server" , config["chartTypeConf"]["server"]);
        chart.setAttribute("service" , config["service"]);
        chart.setAttribute("offering" , config["offering"]);
        chart.setAttribute("procedures" , config["procedures"]);
        chart.setAttribute("property" , config["observedProperties"]);
        chart.setAttribute("from" , config["interval"][0]);
        chart.setAttribute("until" , config["interval"][1]);
        for (var key in config["chartTypeConf"]) {
            if (config["chartTypeConf"][key] !== "") {
                chart.setAttribute(key , config["chartTypeConf"][key]);
            }
        }
        chart.setAttribute("width" , this.getWidth());
        chart.setAttribute("height" , this.getHeight());
        chart.setAttribute("divId" , config["elementId"]);
        console.log(chart);
        
        document.getElementById(config["elementId"]).appendChild(chart);

        return this;
    },
    /**
     * @returns {JSON}
     */
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