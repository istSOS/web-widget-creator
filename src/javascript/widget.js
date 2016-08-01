goog.provide("istsos.widget");

istsos.widget.TYPE_MAP = 'Map';
istsos.widget.TYPE_CHART = 'Chart';
istsos.widget.TYPE_BOX = 'Box';

istsos.widget.TYPES = {};

istsos.widget.TYPES[istsos.widget.TYPE_MAP] = {
    "description": "",
    "class": "istsos.widget.Map"
};

istsos.widget.TYPES[istsos.widget.TYPE_CHART] = {
    "description": "",
    "class": "istsos.widget.Chart"
};

istsos.widget.TYPES[istsos.widget.TYPE_BOX] = {
    "description": "",
    "class": "istsos.widget.Box"
};

/**
 * @param {String} dt1
 * @param {String} dt2
 */
istsos.widget.newerDate = function(dt1, dt2) {
    var dateTime1 = moment(dt1).utc();
    var dateTime2 = moment(dt2).utc();
    if (dateTime1.diff(dateTime2) >= 0) {
        return dateTime1.format();
    } else {
        return dateTime2.format();
    }
};

/**
 * @param {String} dt1
 * @param {String} dt2
 */
istsos.widget.olderDate = function(dt1, dt2) {
    var dateTime1 = moment(dt1);
    var dateTime2 = moment(dt2);
    if (dateTime1.diff(dateTime2) <= 0) {
        return dt1;
    } else {
        return dt2;
    }

};

istsos.widget.SERVER_PROMISE = $.getJSON('specs/server_config.json', function (data) {
});

istsos.widget.OBSERVED_PROPERTIES_URN_PROMISE = $.getJSON('specs/observed_property_urns.json', function (data) {
});

istsos.widget.OBSERVED_PROPERTIES_PROMISE = $.getJSON('specs/observed_property_spec.json', function (data) {
});

istsos.widget.OBSERVED_PROPERTIES_NAMES_PROMISE = $.getJSON('specs/observed_property_names.json', function (data) {
});


istsos.widget.Widget = function () {
    this.service = null;
    this.type = null;
    this.width = null;
    this.height = null;
    this.cssClass = null;
    this.elementId = null;

};

istsos.widget.Widget.prototype = {
    setService: function (serviceName) {
        this.service = serviceName;
    },
    getService: function () {
        return this.service;
    },
    setType: function(type){
        this.type = type;
    },
    getType: function () {
       return this.type;
    },
    setElementId: function(id){
        this.elementId = id;
    },
    getElementId: function () {
        return this.elementId;
    },
    setCssClass: function(cssClass){
        this.cssClass = cssClass;
    },
    getCssClass: function () {
        return this.cssClass;
    },
    setWidth: function(width){
        this.width = width;
    },
    getWidth: function () {
        return this.width;
    },
    setHeight: function(height){
        this.height = height;
    },
    getHeight: function () {
        return this.height;
    },
    build: function(){
        throw "getWidget function shall be overwritten";
    },
    getConfig: function(){
        throw "getConfig function shall be overwritten";
    }
};

istsos.widget.getCode = function(config){
    return "<script src=\"http://localhost/html/web-widget-creator/src/javascript/widget.js\"></script>\n" +
        "<script>\n" +
        "istsos.widget.build(" + JSON.stringify(config) + ");\n" +
        "</script>";
};

istsos.widget.build = function(conf){
    var widget = null;
    switch (conf["type"]){
        case istsos.widget.TYPE_MAP:
            widget = new istsos.widget.Map();
            widget.setElementId(conf["elementId"]);
            widget.setOffering(conf["offering"]);
            widget.setProcedures(conf["procedures"]);
            widget.setObservedProperty(conf["observedProperty"]);
            break;
        case istsos.widget.TYPE_BOX:
            widget = new istsos.widget.Box();
            widget.setElementId(conf["elementId"]);
            widget.setOffering(conf["offering"]);
            widget.setProcedure(conf["procedure"]);
            widget.setObservedProperties(conf["observedProperties"]);
            widget.setInterval(conf["interval"]);
            widget.setLayout(conf["layout"]);
            break;
        case istsos.widget.TYPE_CHART:
            widget = new istsos.widget.Chart();
            break;
        default:
            // Draw the istSOS logo
            break;
    }
    widget.setService(conf["service"]);
    widget.setHeight(conf["height"]);
    widget.setWidth(conf["width"]);
    widget.setCssClass(conf["cssClass"]);
    widget.build();
};

