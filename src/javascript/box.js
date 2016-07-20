goog.provide("istsos.widget.Box");

goog.require("istsos.widget.Widget");

/** istsos.widget.Box class */
/**
 * @constructor
 */
istsos.widget.Box = function () {
    istsos.widget.Widget.call(this);
    this.elementId = null;
    this.box = null;
    this.procedures = [];
    this.observedProperties = [];

    istsos.widget.Widget.prototype.setType.call(this, istsos.widget.TYPE_BOX);

};
goog.inherits(istsos.widget.Map, istsos.widget.Widget);

istsos.widget.Box.prototype = {
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
    /** -------------------------------------------------------------- */
    setElementId: function(id){
        this.elementId = id;
    },
    getElementId: function () {
        return this.elementId;
    },
    addProcedure: function (procedure) {
        this.procedures.push(procedure);
    },
    setProcedures: function (procedureArray) {
        this.procedures = procedureArray;
    },
    getProcedures: function () {
        return this.procedures;
    },
    addObservedProperty: function (observedProperty) {
        this.observedProperties.push(observedProperty);
    },
    setObservedProperties: function (observedPropertiesArray) {
        this.observedProperties = observedPropertiesArray;
    },
    getObservedProperties: function () {
        return this.observedProperties;
    },
    build: function () {
        //build box
        //...
    },
    getConfig: function(){
        return {
            "service": this.service,
            "elementId": this.elementId,
            "type": this.type,
            "procedures": this.procedures,
            "observedProperties": this.observedProperties,
            "width": this.width,
            "height": this.height,
            "cssClass": this.cssClass
        };
    }

};