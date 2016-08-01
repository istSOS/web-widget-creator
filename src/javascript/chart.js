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
    //...

    istsos.widget.Widget.prototype.setType.call(this, istsos.widget.TYPE_CHART);

};
goog.inherits(istsos.widget.Chart, istsos.widget.Widget);