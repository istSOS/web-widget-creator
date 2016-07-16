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

istsos.widget.Widget = function () {
    this.type = null;
    this.width = null;
    this.height = null;
    this.cssClass = null;
};

istsos.widget.Widget.prototype = {
    setType: function(type){
        this.type = type;
    },
    getType: function () {
       return this.type;
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
    return "<script src=\"http://istsos.org/istsos-widget.js\"></script>\n" +
        "<script>\n" +
        "istsos.widget.build(" + JSON.stringify(config) + ");\n" +
        "</script>";
};

istsos.widget.build = function(conf){
    var widget = null;
    switch (conf["type"]){
        case istsos.widget.TYPE_MAP:
            widget = new istsos.widget.Map();
            widget.setProcedure(conf["procedure"]);
            widget.setObservedProperty(conf["observedProperty"]);
            widget.setProcedure(conf["procedure"]);
            break;
        default:
            // Draw the istSOS logo
            break;
    }
    widget.setHeight(conf['height']);
    widget.setWidth(conf['width']);
    widget.build();
};
